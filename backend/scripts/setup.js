import bcrypt from 'bcryptjs';
import db from '../lib/db.js';

// Database setup and initialization script
class DatabaseSetup {
  
  async init() {
    try {
      console.log('🚀 Starting database initialization...');
      
      // Test database connection
      await this.testConnection();
      
      // Create initial admin if none exists
      await this.createInitialAdmin();
      
      // Create sample categories if none exist
      await this.createSampleCategories();
      
      console.log('✅ Database initialization completed successfully!');
      
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🔍 Testing database connection...');
      await db.$connect();
      
      // Test a simple query
      await db.admin.count();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async createInitialAdmin() {
    try {
      console.log('👤 Checking for existing admins...');
      
      const adminCount = await db.admin.count();
      
      if (adminCount > 0) {
        console.log(`✅ Found ${adminCount} existing admin(s), skipping creation`);
        return;
      }

      console.log('🔧 No admins found, creating initial admin...');
      
      // Default admin credentials (should be changed after first login)
      const defaultAdmin = {
        username: 'admin',
        email: 'admin@elouarate.com',
        password: 'Admin123!@#'
      };

      // Hash password
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 12);

      // Create admin - using the current schema structure
      const admin = await db.admin.create({
        data: {
          username: defaultAdmin.username,
          email: defaultAdmin.email,
          password: hashedPassword,
          isActive: true
        }
      });

      console.log('✅ Initial admin created successfully!');
      console.log('📧 Email:', defaultAdmin.email);
      console.log('🔑 Password:', defaultAdmin.password);
      console.log('⚠️  IMPORTANT: Please change the default password after first login!');
      
      return admin;
      
    } catch (error) {
      console.error('❌ Failed to create initial admin:', error);
      throw error;
    }
  }

  async createSampleCategories() {
    try {
      console.log('📂 Checking for existing categories...');
      
      const categoryCount = await db.category.count();
      
      if (categoryCount > 0) {
        console.log(`✅ Found ${categoryCount} existing categories, skipping creation`);
        return;
      }

      console.log('🎨 Creating sample categories...');
      
      const sampleCategories = [
        {
          name: 'Paintings',
          description: 'Beautiful paintings and canvas art',
          color: '#ef4444',
          sortOrder: 1
        },
        {
          name: 'Sculptures',
          description: 'Three-dimensional art pieces',
          color: '#3b82f6',
          sortOrder: 2
        },
        {
          name: 'Photography',
          description: 'Captured moments and artistic photography',
          color: '#10b981',
          sortOrder: 3
        },
        {
          name: 'Digital Art',
          description: 'Modern digital and computer-generated art',
          color: '#8b5cf6',
          sortOrder: 4
        },
        {
          name: 'Mixed Media',
          description: 'Art combining multiple mediums and techniques',
          color: '#f59e0b',
          sortOrder: 5
        }
      ];

      const categories = await db.category.createMany({
        data: sampleCategories
      });

      console.log(`✅ Created ${sampleCategories.length} sample categories`);
      
      return categories;
      
    } catch (error) {
      console.error('❌ Failed to create sample categories:', error);
      throw error;
    }
  }

  async listAdmins() {
    try {
      const admins = await db.admin.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          isActive: true,
          lastLogin: true,
          createdAt: true
        }
      });

      console.log('\n📋 Current Admins:');
      console.log('=====================================');
      
      if (admins.length === 0) {
        console.log('No admins found in the database.');
      } else {
        admins.forEach((admin, index) => {
          console.log(`${index + 1}. ${admin.username} (${admin.email})`);
          console.log(`   - ID: ${admin.id}`);
          console.log(`   - Active: ${admin.isActive ? 'Yes' : 'No'}`);
          console.log(`   - Last Login: ${admin.lastLogin ? admin.lastLogin.toISOString() : 'Never'}`);
          console.log(`   - Created: ${admin.createdAt.toISOString()}`);
          console.log('   ---');
        });
      }
      
      return admins;
      
    } catch (error) {
      console.error('❌ Failed to list admins:', error);
      throw error;
    }
  }

  async resetAdminPassword(email, newPassword) {
    try {
      console.log(`🔄 Resetting password for admin: ${email}`);
      
      const admin = await db.admin.findUnique({
        where: { email }
      });

      if (!admin) {
        throw new Error(`Admin with email ${email} not found`);
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await db.admin.update({
        where: { id: admin.id },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      });

      console.log('✅ Admin password reset successfully');
      
    } catch (error) {
      console.error('❌ Failed to reset admin password:', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await db.$disconnect();
      console.log('🔌 Database connection closed');
    } catch (error) {
      console.error('❌ Error closing database connection:', error);
    }
  }
}

// CLI interface for running setup commands
async function runSetup() {
  const setup = new DatabaseSetup();
  
  try {
    const command = process.argv[2];
    
    switch (command) {
      case 'init':
        await setup.init();
        break;
        
      case 'create-admin':
        await setup.createInitialAdmin();
        break;
        
      case 'create-categories':
        await setup.createSampleCategories();
        break;
        
      case 'list-admins':
        await setup.listAdmins();
        break;
        
      case 'reset-password':
        const email = process.argv[3];
        const password = process.argv[4];
        
        if (!email || !password) {
          console.error('❌ Usage: npm run admin:reset-password <email> <new-password>');
          process.exit(1);
        }
        
        await setup.resetAdminPassword(email, password);
        break;
        
      case 'test':
        await setup.testConnection();
        console.log('✅ Database connection test passed');
        break;
        
      default:
        console.log(`
🚀 Database Setup Tool

Available commands:
  init              - Full database initialization (recommended for first setup)
  create-admin      - Create initial admin account
  create-categories - Create sample categories
  list-admins       - List all admin accounts
  reset-password    - Reset admin password: reset-password <email> <new-password>
  test              - Test database connection

Examples:
  npm run db:setup
  npm run db:list-admins
  npm run admin:reset-password admin@elouarate.com NewPassword123!
  npm run db:test
        `);
        break;
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await setup.cleanup();
  }
}

// Run if called directly
runSetup();