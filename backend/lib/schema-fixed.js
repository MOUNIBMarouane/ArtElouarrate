import { query } from './database.js';
import crypto from 'crypto';

// Simple ID generator (like Prisma's cuid)
function generateId() {
  return 'cat_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
}

function generateArtworkId() {
  return 'art_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
}

function generateAdminId() {
  return 'adm_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
}

export async function checkAndInitialize() {
  try {
    console.log('Ì¥ç Using existing database schema (Prisma format)...');
    
    // Check if we have data in categories
    const categoriesCheck = await query('SELECT COUNT(*) FROM categories');
    const categoryCount = parseInt(categoriesCheck.rows[0].count);
    
    console.log(`Ì≥Ç Found ${categoryCount} categories`);
    
    if (categoryCount === 0) {
      console.log('Ì≥ù Adding initial categories...');
      
      // Generate IDs for categories
      const abstractId = generateId();
      const landscapeId = generateId();
      const portraitId = generateId();
      const urbanId = generateId();
      const digitalId = generateId();
      
      await query(`
        INSERT INTO categories (id, name, description, color, "sortOrder", "isActive", "createdAt", "updatedAt") VALUES
        ($1, 'Abstract', 'Abstract art pieces with vibrant colors and forms', '#6366f1', 1, true, NOW(), NOW()),
        ($2, 'Landscape', 'Nature and landscape art capturing natural beauty', '#10b981', 2, true, NOW(), NOW()),
        ($3, 'Portrait', 'Portrait artwork showcasing human expression', '#f59e0b', 3, true, NOW(), NOW()),
        ($4, 'Urban', 'Modern urban and city-inspired artworks', '#8b5cf6', 4, true, NOW(), NOW()),
        ($5, 'Digital Art', 'Contemporary digital and mixed media art', '#06b6d4', 5, true, NOW(), NOW())
      `, [abstractId, landscapeId, portraitId, urbanId, digitalId]);
      
      console.log('‚úÖ Categories created successfully');
    }
    
    // Check artworks
    const artworksCheck = await query('SELECT COUNT(*) FROM artworks WHERE "isActive" = true');
    const artworkCount = parseInt(artworksCheck.rows[0].count);
    
    console.log(`Ìæ® Found ${artworkCount} active artworks`);
    
    if (artworkCount === 0) {
      console.log('Ì≥ù Adding sample artworks...');
      
      // Get category IDs
      const categories = await query('SELECT id, name FROM categories ORDER BY "sortOrder"');
      
      if (categories.rows.length >= 3) {
        const artwork1Id = generateArtworkId();
        const artwork2Id = generateArtworkId();
        const artwork3Id = generateArtworkId();
        
        await query(`
          INSERT INTO artworks (id, name, description, price, "originalPrice", "categoryId", "isActive", "isFeatured", medium, dimensions, year, status, "viewCount", "createdAt", "updatedAt") VALUES
          ($1, 'Abstract Harmony', 'A stunning abstract piece that captures movement and emotion', 599.99, 799.99, $4, true, true, 'Acrylic on Canvas', '36x48 inches', 2023, 'available', 0, NOW(), NOW()),
          ($2, 'Mountain Serenity', 'Peaceful landscape depicting tranquil mountain ranges', 899.99, null, $5, true, true, 'Oil on Canvas', '40x30 inches', 2023, 'available', 0, NOW(), NOW()),
          ($3, 'City Pulse', 'Dynamic urban artwork capturing metropolitan energy', 450.00, 550.00, $6, true, false, 'Mixed Media', '24x36 inches', 2024, 'available', 0, NOW(), NOW())
        `, [artwork1Id, artwork2Id, artwork3Id, categories.rows[0].id, categories.rows[1].id, categories.rows[2].id]);
        
        console.log('‚úÖ Sample artworks created successfully');
      }
    }
    
    // Check for admin
    const adminCheck = await query('SELECT COUNT(*) FROM admins WHERE "isActive" = true');
    const adminCount = parseInt(adminCheck.rows[0].count);
    
    console.log(`Ì±§ Found ${adminCount} active admins`);
    
    if (adminCount === 0) {
      console.log('Ì±§ Creating default admin...');
      
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 12);
      const adminId = generateAdminId();
      
      await query(`
        INSERT INTO admins (id, username, email, password, "isActive", "isSuperAdmin", permissions, "createdAt", "updatedAt") VALUES
        ($1, 'admin', 'admin@elouarate.com', $2, true, true, '["all"]', NOW(), NOW())
      `, [adminId, hashedPassword]);
      
      console.log('Ì¥ë Default admin: admin@elouarate.com / admin123');
    }
    
    console.log('‚úÖ Database initialization complete!');
    return true;
    
  } catch (error) {
    console.error('‚ùå Error initializing database:', error);
    return false;
  }
}
