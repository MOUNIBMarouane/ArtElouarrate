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
    const { email, password } = req.body;
    const result = await adminService.loginAdmin(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
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
        where: { id: decoded.id }
      });
      return admin;
    } catch (error) {
      console.error('Admin validation error:', error.message);
      return null;
    }
  },

  async createAdmin(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword
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
      const admin = await prisma.admin.findUnique({
        where: { email }
      });
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { admin, token };
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
    const port = process.env.PORT || 3001;
    
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
