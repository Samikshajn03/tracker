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
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const file = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    try {
      const filePath = file.filepath || file.path;
      if (!filePath) {
        return res.status(400).json({ error: 'File path not found' });
      }

      const fileData = fs.readFileSync(filePath);
      const key = `profile-images/${uuidv4()}-${file.originalFilename}`;

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: fileData,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      await pool.query(
        'UPDATE users SET profile_image_url = $1 WHERE email = $2',
        [imageUrl, email]
      );

      return res.status(200).json({ imageUrl });
    } catch (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Upload or DB update failed' });
    }
  });
}
