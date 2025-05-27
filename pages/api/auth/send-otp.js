import pool from '../../../lib/db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    // Check if email exists in users table
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Email not registered' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Insert OTP into database
    await pool.query(
      'INSERT INTO email_otps (email, otp, expires_at) VALUES ($1, $2, $3)',
      [email, otp, expiresAt]
    );

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Tracker App OTP Code',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
}
