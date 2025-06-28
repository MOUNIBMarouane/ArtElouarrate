import { query } from './lib/database.js';

async function checkSchema() {
  console.log('Ì¥ç Checking existing database schema...');
  
  try {
    // Check what tables exist
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('Ì≥ã Existing tables:', tables.rows.map(r => r.table_name));
    
    // Check artworks table structure
    const artworksColumns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'artworks' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nÌæ® Artworks table columns:');
    artworksColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
    // Check categories table structure
    const categoriesColumns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'categories' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nÌ≥Ç Categories table columns:');
    categoriesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });
    
  } catch (error) {
    console.error('‚ùå Error checking schema:', error.message);
  }
}

checkSchema();
