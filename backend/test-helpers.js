import { db } from './lib/db-helpers.js';

async function testHelpers() {
  console.log('� Testing database helpers...');
  
  try {
    // Test categories
    const categories = await db.category.findMany({ 
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`✅ Found ${categories.length} categories`);
    
    // Test artworks
    const artworks = await db.artwork.findMany({
      where: { isActive: true }
    });
    console.log(`✅ Found ${artworks.length} artworks`);
    
    // Test counts
    const categoryCount = await db.category.count();
    const artworkCount = await db.artwork.count();
    console.log(`✅ Counts: ${categoryCount} categories, ${artworkCount} artworks`);
    
    console.log('� All helpers working perfectly!');
    
  } catch (error) {
    console.error('❌ Helper test failed:', error);
  }
}

testHelpers();
