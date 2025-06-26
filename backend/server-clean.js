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

// Mount routes
app.use('/', sitemapRoutes);

// Admin service
const adminService = {
  // ... rest of the admin service code ...
  
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
