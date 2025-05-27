import pool from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

      const usernameCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (usernameCheck.rows.length > 0) {
    return res.status(400).json({ message: 'Username already taken' });
  }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, hashedPassword ]
    );

    const user = result.rows[0];

  
    const token = jwt.sign({id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
