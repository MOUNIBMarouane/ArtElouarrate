#!/usr/bin/env node

/**
 * 🎨 ELOUARATE ART - Professional Clean Server
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import prisma from './lib/db.js';
import sitemapRoutes from './routes/sitemap.js';
import emailService from './services/email-service.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// Admin routes
app.post('/api/admin/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }
    const result = await adminService.loginAdmin(emailOrUsername, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/api/admin/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password and username are required' });
    }
    const admin = await adminService.createAdmin(email, password, username);
    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/admin/validate', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const admin = await adminService.validateAdmin(token);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json({ admin });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/', sitemapRoutes);

// Admin service
const adminService = {
  async validateAdmin(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          username: true,
          isActive: true,
          isSuperAdmin: true,
          permissions: true
        }
      });
      
      if (!admin || !admin.isActive) {
        return null;
      }
      
      return admin;
    } catch (error) {
      console.error('Admin validation error:', error.message);
      return null;
    }
  },

  async createAdmin(email, password, username) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          username,
          isActive: true,
          permissions: '[]'
        }
      });
      return admin;
    } catch (error) {
      console.error('Create admin error:', error.message);
      throw error;
    }
  },

  async loginAdmin(email, password) {
    try {
      const admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { email },
            { username: email } // Allow login with either email or username
          ],
          isActive: true
        }
      });
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      if (admin.lockoutUntil && admin.lockoutUntil > new Date()) {
        throw new Error('Account is temporarily locked');
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        // Update login attempts
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            loginAttempts: admin.loginAttempts + 1,
            lockoutUntil: admin.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes after 5 attempts
          }
        });
        throw new Error('Invalid password');
      }

      // Reset login attempts on successful login
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          loginAttempts: 0,
          lockoutUntil: null,
          lastLogin: new Date()
        }
      });

      const token = jwt.sign(
        { 
          id: admin.id,
          email: admin.email,
          username: admin.username,
          isSuperAdmin: admin.isSuperAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { 
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          isSuperAdmin: admin.isSuperAdmin,
          permissions: JSON.parse(admin.permissions)
        }
      };
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },
  
  async disconnect() {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error('Disconnect error:', error.message);
    }
  }
};

// Start server
const startServer = async () => {
  try {
    const port = process.env.PORT || 3000;
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const cleanup = async (signal) => {
  console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
  try {
    await adminService.disconnect();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

// Register cleanup handlers
process.on('SIGTERM', () => cleanup('SIGTERM'));
process.on('SIGINT', () => cleanup('SIGINT'));

// Start the server
startServer();
