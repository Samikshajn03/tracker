

import pool from '../../../lib/db.js'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM email_otps 
       WHERE email = $1 AND otp = $2 AND expires_at > NOW() 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    return res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ success: false, error: 'Server error while verifying OTP' });
  }
}
