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
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
  if (err) return res.status(500).json({ error: 'Upload failed' });

  const uploadedUrls = [];

  const destinationId = Array.isArray(fields.destinationId)
    ? parseInt(fields.destinationId[0], 10)
    : parseInt(fields.destinationId, 10);

  if (!destinationId || isNaN(destinationId)) {
    return res.status(400).json({ error: 'Invalid or missing destinationId' });
  }

  const imageFiles = Array.isArray(files.images) ? files.images : [files.images];

    try {
      for (const file of imageFiles) {
        const fileData = fs.readFileSync(file.filepath);
        const key = `uploads/${uuidv4()}-${file.originalFilename}`;

        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: fileData,
          ContentType: file.mimetype
        };

        await s3.send(new PutObjectCommand(uploadParams));
        const uploadedUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        uploadedUrls.push(uploadedUrl);

        // Insert into photos table with destination_id
        await pool.query(
          `INSERT INTO photos (destination_id, image_url) VALUES ($1, $2)`,
          [destinationId, uploadedUrl]
        );
      }

      res.status(200).json({ imageUrls: uploadedUrls });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      res.status(500).json({ error: 'Upload or DB insert failed' });
    }
  });
}
