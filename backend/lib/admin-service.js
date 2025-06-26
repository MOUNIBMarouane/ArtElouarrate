import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Professional Admin Management Service
 * Handles all admin operations with proper database integration
 */
class AdminService {
  constructor() {
    this.defaultAdminEmail = 'admin@elouarate.com';
    this.defaultAdminPassword = 'Admin123!';
    this.SALT_ROUNDS = 12;
  }

  /**
   * Initialize admin system - create default admin if none exists
   */
  async initializeAdminSystem() {
    try {
      console.log('🔐 Initializing admin system...');
      
      // Check if any admin exists in database
      const adminCount = await prisma.admin.count({
        where: { isActive: true }
      });

      if (adminCount > 0) {
        console.log('✅ Admin system already initialized');
        return { initialized: true, created: false };
      }

      // Create default admin
      const defaultAdmin = await this.createDefaultAdmin();
      console.log('✅ Default admin created successfully');
      
      return { initialized: true, created: true, admin: defaultAdmin };
    } catch (error) {
      console.error('❌ Failed to initialize admin system:', error.message);
      return { initialized: false, error: error.message };
    }
  }

  /**
   * Create default admin account
   */
  async createDefaultAdmin() {
    try {
      // Hash default password
      const hashedPassword = await this.hashPassword(this.defaultAdminPassword);
      
      const admin = await prisma.admin.create({
        data: {
          username: 'admin',
          email: this.defaultAdminEmail,
          password: hashedPassword,
          isActive: true,
          passwordResetAttempts: 0
        }
      });

      console.log(`✅ Default admin created with ID: ${admin.id}`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🔑 Password: ${this.defaultAdminPassword}`);
      
      return admin;
    } catch (error) {
      console.error('❌ Error creating default admin:', error.message);
      throw error;
    }
  }

  /**
   * Check if any admin exists
   */
  async adminExists() {
    try {
      const count = await prisma.admin.count({
        where: { isActive: true }
      });
      return count > 0;
    } catch (error) {
      console.error('❌ Error checking admin existence:', error.message);
      return false;
    }
  }

  /**
   * Find admin by email
   */
  async findAdminByEmail(email) {
    try {
      return await prisma.admin.findFirst({
        where: {
          email: email.toLowerCase(),
          isActive: true
        }
      });
    } catch (error) {
      console.error('❌ Error finding admin by email:', error.message);
      return null;
    }
  }

  /**
   * Find admin by ID
   */
  async findAdminById(id) {
    try {
      return await prisma.admin.findUnique({
        where: { id, isActive: true }
      });
    } catch (error) {
      console.error('❌ Error finding admin by ID:', error.message);
      return null;
    }
  }

  /**
   * Authenticate admin login
   */
  async authenticateAdmin(email, password) {
    try {
      // Check if any admin exists in the system
      const adminExists = await this.adminExists();
      
      // Only allow default credentials if no admin exists
      if (!adminExists && 
          email === this.defaultAdminEmail && 
          password === this.defaultAdminPassword) {
        // Create the default admin account
        const defaultAdmin = await this.createDefaultAdmin();
        const tokens = this.generateTokens(defaultAdmin);
        
        return {
          success: true,
          admin: {
            id: defaultAdmin.id,
            username: defaultAdmin.username,
            email: defaultAdmin.email,
            lastLogin: new Date()
          },
          ...tokens
        };
      }

      // Normal authentication flow
      const admin = await this.findAdminByEmail(email);
      
      if (!admin) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check password
      const isValidPassword = await this.verifyPassword(password, admin.password);
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() }
      });

      // Generate tokens
      const tokens = this.generateTokens(admin);

      return {
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          lastLogin: new Date()
        },
        ...tokens
      };
    } catch (error) {
      console.error('❌ Authentication error:', error.message);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Create new admin
   */
  async createAdmin(adminData) {
    try {
      const { username, email, password } = adminData;

      // Check if admin already exists
      const existing = await this.findAdminByEmail(email);
      if (existing) {
        throw new Error('Admin with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      const admin = await prisma.admin.create({
        data: {
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          isActive: true,
          passwordResetAttempts: 0
        }
      });

      console.log(`✅ New admin created: ${admin.email}`);
      
      return admin;
    } catch (error) {
      console.error('❌ Error creating admin:', error.message);
      throw error;
    }
  }

  /**
   * Update admin password
   */
  async updatePassword(adminId, currentPassword, newPassword) {
    try {
      const admin = await this.findAdminById(adminId);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      // Verify current password
      if (!await this.verifyPassword(currentPassword, admin.password)) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      await prisma.admin.update({
        where: { id: adminId },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      });

      console.log(`✅ Password updated for admin: ${admin.email}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating password:', error.message);
      throw error;
    }
  }

  /**
   * Password reset functionality
   */
  async initiatePasswordReset(email) {
    try {
      const admin = await this.findAdminByEmail(email);
      
      if (!admin) {
        // Return success to prevent email enumeration
        return { success: true, message: 'If account exists, reset email sent' };
      }

      // Check rate limiting
      if (await this.isRateLimited(admin)) {
        throw new Error('Too many reset attempts. Please try again later.');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update admin with reset token
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiresAt,
          passwordResetAttempts: admin.passwordResetAttempts + 1,
          lastPasswordReset: new Date()
        }
      });

      console.log(`✅ Password reset initiated for: ${email}`);
      console.log(`📧 Reset token: ${resetToken}`);
      
      return { 
        success: true, 
        token: resetToken, 
        admin,
        message: 'Reset token generated'
      };
    } catch (error) {
      console.error('❌ Password reset error:', error.message);
      throw error;
    }
  }

  /**
   * Complete password reset
   */
  async completePasswordReset(token, newPassword) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const now = new Date();

      // Find admin with valid token
      const admin = await prisma.admin.findFirst({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpires: { gt: now },
          isActive: true
        }
      });

      if (!admin) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update admin
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          passwordResetAttempts: 0,
          updatedAt: now
        }
      });

      console.log(`✅ Password reset completed for: ${admin.email}`);
      
      return { success: true, admin };
    } catch (error) {
      console.error('❌ Password reset completion error:', error.message);
      throw error;
    }
  }

  /**
   * Check if admin is rate limited for password resets
   */
  async isRateLimited(admin) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return admin.passwordResetAttempts >= 5 && 
           admin.lastPasswordReset && 
           admin.lastPasswordReset > oneHourAgo;
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password) {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password using bcrypt
   */
  async verifyPassword(inputPassword, storedPassword) {
    try {
      return await bcrypt.compare(inputPassword, storedPassword);
    } catch (error) {
      console.error('❌ Password verification error:', error.message);
      return false;
    }
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(admin) {
    const accessToken = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: 'ADMIN',
        type: 'admin'
      },
      process.env.JWT_SECRET || 'development-jwt-secret',
      { expiresIn: '2h' }
    );

    const refreshToken = jwt.sign(
      { id: admin.id, type: 'admin_refresh' },
      process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Get admin statistics
   */
  async getAdminStats() {
    try {
      const totalAdmins = await prisma.admin.count();
      const activeAdmins = await prisma.admin.count({ where: { isActive: true } });
      const recentLogins = await prisma.admin.count({
        where: {
          lastLogin: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      });

      return {
        total: totalAdmins,
        active: activeAdmins,
        recentLogins
      };
    } catch (error) {
      console.error('❌ Error getting admin stats:', error.message);
      return { total: 0, active: 0, recentLogins: 0 };
    }
  }

  /**
   * Cleanup expired reset tokens
   */
  async cleanupExpiredTokens() {
    try {
      const result = await prisma.admin.updateMany({
        where: {
          passwordResetExpires: { lt: new Date() },
          passwordResetToken: { not: null }
        },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null
        }
      });

      if (result.count > 0) {
        console.log(`🧹 Cleaned up ${result.count} expired reset tokens`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up tokens:', error.message);
    }
  }

  /**
   * Close database connection
   */
  async disconnect() {
    await prisma.$disconnect();
  }
}

export default new AdminService(); 