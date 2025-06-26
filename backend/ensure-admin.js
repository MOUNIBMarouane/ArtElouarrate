import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function ensureDefaultAdmin() {
  try {
    console.log('🔐 Checking for admin existence...');
    
    // Check if any admin exists
    const adminCount = await prisma.user.count({
      where: { 
        role: 'ADMIN',
        isActive: true 
      }
    });

    if (adminCount > 0) {
      console.log('✅ Admin user already exists');
      return { exists: true, created: false };
    }

    console.log('🔧 No admin found, creating default admin...');

    // Create default admin
    const password = 'Admin123!';
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@elouarate.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true
      }
    });

    console.log('✅ Default admin created successfully:');
    console.log(`   Email: admin@elouarate.com`);
    console.log(`   Password: Admin123!`);
    console.log(`   ID: ${admin.id}`);

    // Also create in admins table for compatibility if it exists
    try {
      await prisma.admin.create({
        data: {
          username: 'admin',
          email: 'admin@elouarate.com',
          password: hashedPassword,
          isActive: true
        }
      });
      console.log('✅ Admin also created in admins table');
    } catch (error) {
      console.log('⚠️  Admins table might not exist, skipping...');
    }

    return { exists: true, created: true, admin };

  } catch (error) {
    console.error('❌ Error ensuring admin:', error);
    return { exists: false, created: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ensureDefaultAdmin();
} 