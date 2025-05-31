import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    // Fetch user info
    const userQuery = 'SELECT username, email, profile_image_url FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Fetch count of distinct countries and cities traveled by user
    // Assuming destinations table has columns: user_id, country, city
    const travelQuery = `
      SELECT 
        COUNT(DISTINCT country) AS countries_traveled,
        COUNT(DISTINCT city) AS cities_traveled
      FROM destinations
      WHERE user_id = $1
    `;
    const travelResult = await pool.query(travelQuery, [user_id]);
    const travelData = travelResult.rows[0];

    // Combine user info with travel stats
    return res.status(200).json({
      ...user,
      countries_traveled: parseInt(travelData.countries_traveled, 10),
      cities_traveled: parseInt(travelData.cities_traveled, 10),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
