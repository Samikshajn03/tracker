import { IncomingForm } from 'formidable';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Form parse failed' });
    }

    // Extract fields safely
    const userIdRaw = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const country = Array.isArray(fields.country) ? fields.country[0] : fields.country;
    const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
    const memory = Array.isArray(fields.memory) ? fields.memory[0] : fields.memory;

    const userId = parseInt(userIdRaw, 10);

    if (!userId || !country || !city || !memory) {
      return res.status(400).json({ error: 'User ID, country, city, and memory are required.' });
    }

    // Insert destination
    let destination;
    try {
      const result = await pool.query(
        `INSERT INTO destinations (user_id, country, city, memory, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, user_id, country, city, memory, created_at`,
        [userId, country, city, memory]
      );
      destination = result.rows[0];
    } catch (dbError) {
      console.error('Destination DB error:', dbError);
      return res.status(500).json({ error: 'Failed to create destination' });
    }

    const destinationId = destination.id;
    const uploadedUrls = [];

    // Optional image upload
    if (files.images) {
      const imageFiles = Array.isArray(files.images) ? files.images : [files.images];
      try {
        for (const file of imageFiles) {
          const fileData = fs.readFileSync(file.filepath);
          const key = `uploads/${uuidv4()}-${file.originalFilename}`;

          await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileData,
            ContentType: file.mimetype,
          }));

          const uploadedUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
          uploadedUrls.push(uploadedUrl);

          await pool.query(
            `INSERT INTO photos (destination_id, image_url) VALUES ($1, $2)`,
            [destinationId, uploadedUrl]
          );
        }
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ error: 'Image upload or DB insert failed' });
      }
    }

    // ✅ Success
    return res.status(200).json({
      message: 'Destination created and images uploaded successfully',
      destination,
      imageUrls: uploadedUrls,
    });
  });
}
