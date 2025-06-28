import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Business-grade connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                      // Maximum connections for scaling
  idleTimeoutMillis: 30000,     // Close idle connections  
  connectionTimeoutMillis: 2000, // Fast connection timeout
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection with retry logic
export async function testConnection() {
  let retries = 3;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW(), version()');
      client.release();
      console.log('‚úÖ Connected to Railway PostgreSQL');
      console.log('Ì≥ä Database:', result.rows[0].version.split(' ')[1]);
      return true;
    } catch (error) {
      console.log(`‚ùå Database connection failed (${retries} retries left):`, error.message);
      retries--;
      if (retries === 0) return false;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
}

// Execute query with error handling
export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Ì≥ä Query executed', { duration: `${duration}ms`, rows: result.rowCount });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('‚ùå Query error', { duration: `${duration}ms`, error: error.message, query: text });
    throw error;
  }
}

// Transaction support for business operations
export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
