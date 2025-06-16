
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});


export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res; 
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database query failed: ' + error.message); 
  }
};
