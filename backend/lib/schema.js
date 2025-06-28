import { query } from './database.js';

export async function createTables() {
  try {
    console.log('ÌøóÔ∏è Setting up business database schema...');
    
    // Users table (matches your existing schema)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        password VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        is_active BOOLEAN DEFAULT true,
        is_email_verified BOOLEAN DEFAULT false,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expiry TIMESTAMP,
        last_login TIMESTAMP,
        login_attempts INTEGER DEFAULT 0,
        lockout_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Admins table (matches your existing admin system)
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        is_super_admin BOOLEAN DEFAULT false,
        permissions TEXT DEFAULT '["read", "write"]',
        last_login TIMESTAMP,
        login_attempts INTEGER DEFAULT 0,
        lockout_until TIMESTAMP,
        password_reset_token VARCHAR(255),
        password_reset_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#6366f1',
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Artworks table (matches your business model)
    await query(`
      CREATE TABLE IF NOT EXISTS artworks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        medium VARCHAR(100),
        dimensions VARCHAR(100),
        year INTEGER,
        category_id INTEGER REFERENCES categories(id),
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Artwork images table
    await query(`
      CREATE TABLE IF NOT EXISTS artwork_images (
        id SERIAL PRIMARY KEY,
        artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
        image_url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Business tables for orders and customers
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address_line1 VARCHAR(255),
        city VARCHAR(100),
        country VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        order_number VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        artwork_id INTEGER REFERENCES artworks(id),
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Performance indexes
    console.log('Ì≥à Creating performance indexes...');
    await query('CREATE INDEX IF NOT EXISTS idx_artworks_active ON artworks(is_active)');
    await query('CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(is_featured)');
    await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await query('CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email)');
    
    console.log('‚úÖ Business database schema created successfully');
    return true;
  } catch (error) {
    console.error('‚ùå Error creating database schema:', error);
    return false;
  }
}

// Insert initial business data
export async function insertInitialData() {
  try {
    // Check if we need initial data
    const categoriesCheck = await query('SELECT COUNT(*) FROM categories');
    if (parseInt(categoriesCheck.rows[0].count) === 0) {
      console.log('Ì≥ù Setting up initial business data...');
      
      // Categories for art gallery
      await query(`
        INSERT INTO categories (name, description, color, sort_order) VALUES
        ('Abstract', 'Abstract art pieces with vibrant colors and forms', '#6366f1', 1),
        ('Landscape', 'Nature and landscape art capturing natural beauty', '#10b981', 2),
        ('Portrait', 'Portrait artwork showcasing human expression', '#f59e0b', 3),
        ('Urban', 'Modern urban and city-inspired artworks', '#8b5cf6', 4),
        ('Digital Art', 'Contemporary digital and mixed media art', '#06b6d4', 5)
      `);

      // Sample artworks for business demo
      await query(`
        INSERT INTO artworks (name, description, price, original_price, category_id, is_featured, medium, dimensions, year) VALUES
        ('Abstract Harmony', 'A stunning abstract piece that captures movement and emotion through bold colors and dynamic forms', 599.99, 799.99, 1, true, 'Acrylic on Canvas', '36x48 inches', 2023),
        ('Mountain Serenity', 'Peaceful landscape depicting the tranquil beauty of mountain ranges at dawn', 899.99, NULL, 2, true, 'Oil on Canvas', '40x30 inches', 2023),
        ('City Pulse', 'Dynamic urban artwork capturing the energy and rhythm of metropolitan life', 450.00, 550.00, 4, false, 'Mixed Media', '24x36 inches', 2024)
      `);
    }

    // Check if default admin exists
    const adminCheck = await query('SELECT COUNT(*) FROM admins');
    if (parseInt(adminCheck.rows[0].count) === 0) {
      console.log('Ì±§ Creating default admin account...');
      
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 12);
      
      await query(`
        INSERT INTO admins (username, email, password, is_super_admin, permissions) VALUES
        ('admin', 'admin@elouarate.com', $1, true, '["all"]')
      `, [hashedPassword]);
      
      console.log('Ì¥ë Default admin: admin@elouarate.com / admin123');
    }
    
    console.log('‚úÖ Initial business data setup complete');
    return true;
  } catch (error) {
    console.error('‚ùå Error inserting initial data:', error);
    return false;
  }
}
