import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
      const query = `
      SELECT 
  d.id, 
  d.country, 
  d.city, 
  d.memory, 
  d.created_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', p.id,
        'url', p.image_url
      )
    ) FILTER (WHERE p.id IS NOT NULL),
    '[]'
  ) AS photos
FROM Destinations d
LEFT JOIN photos p ON d.id = p.destination_id
WHERE d.user_id = $1
GROUP BY d.id;



      `;

      const result = await pool.query(query, [userId]);

      return res.status(200).json({
        message: 'Data fetched with images',
        data: result.rows,
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
