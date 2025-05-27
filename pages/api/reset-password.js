import pool from '../../lib/db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password required' });
  }

  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in users table (adjust table/column names)
    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
    );

    // Optionally delete OTPs after password reset
    await pool.query('DELETE FROM email_otps WHERE email = $1', [email]);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
}
