import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { latitude, longitude, label, user_id } = req.body;

    if (!latitude || !longitude || !user_id) {
      return res.status(400).json({ error: 'Latitude, longitude, and user_id are required' });
    }

    try {
      await pool.query(
        'INSERT INTO mapmarkers (latitude, longitude, label, user_id) VALUES ($1, $2, $3, $4)',
        [latitude, longitude, label || null, user_id]
      );
      return res.status(201).json({ message: 'Marker saved successfully' });
    } catch (error) {
         console.error('DB insert error:', error);
      return res.status(500).json({ error: 'Failed to save marker', details: error.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM mapmarkers ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch markers', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
