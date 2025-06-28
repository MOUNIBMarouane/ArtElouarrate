import { db } from './lib/db-helpers.js';

async function testHelpers() {
  console.log('Ì∑™ Testing database helpers...');
  
  try {
    // Test categories
    const categories = await db.category.findMany({ 
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`‚úÖ Found ${categories.length} categories`);
    
    // Test artworks
    const artworks = await db.artwork.findMany({
      where: { isActive: true }
    });
    console.log(`‚úÖ Found ${artworks.length} artworks`);
    
    // Test counts
    const categoryCount = await db.category.count();
    const artworkCount = await db.artwork.count();
    console.log(`‚úÖ Counts: ${categoryCount} categories, ${artworkCount} artworks`);
    
    console.log('Ìæâ All helpers working perfectly!');
    
  } catch (error) {
    console.error('‚ùå Helper test failed:', error);
  }
}

testHelpers();
