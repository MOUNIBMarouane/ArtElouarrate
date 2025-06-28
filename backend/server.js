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
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Our new database system (replacing Prisma)
import { testConnection } from './lib/database.js';
import { checkAndInitialize } from './lib/schema-fixed.js';
import { db } from './lib/db-helpers.js';

// Your existing routes and services
import sitemapRoutes from './routes/sitemap.js';
import adminRoutes from './routes/admin.js';

// Initialize ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
let dbConnected = false;

// Initialize database
async function initDatabase() {
  try {
    console.log('í´„ Initializing business database...');
    dbConnected = await testConnection();
    if (dbConnected) {
      await checkAndInitialize();
      console.log('âœ… Database ready for business operations');
    }
  } catch (error) {
    console.log('âš ï¸ Database initialization failed:', error.message);
    dbConnected = false;
  }
}

// Business-grade middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.railway.app'] 
    : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// Rate limiting for business protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// File upload setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Auth middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// =============================================================================
// BUSINESS API ENDPOINTS
// =============================================================================

// System Health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'Railway PostgreSQL Connected' : 'Database not connected',
    version: '2.0.0 - Business Ready'
  });
});

// Categories API (Your business categories)
app.get('/api/categories', async (req, res) => {
  try {
    console.log('í³‚ GET /api/categories - Fetching business categories');
    
    const categories = await db.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    res.json({
      success: true,
      data: categories,
      total: categories.length,
      source: 'database'
    });
  } catch (error) {
    console.error('âŒ Categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Artworks API (Your business products)
app.get('/api/artworks', async (req, res) => {
  try {
    console.log('í¾¨ GET /api/artworks - Fetching business artworks');
    
    const { search, category, featured } = req.query;
    const whereClause = { isActive: true };
    
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }
    
    const artworks = await db.artwork.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    // Filter by search if provided
    let filteredArtworks = artworks;
    if (search) {
      filteredArtworks = artworks.filter(artwork => 
        artwork.name.toLowerCase().includes(search.toLowerCase()) ||
        artwork.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: filteredArtworks,
      total: filteredArtworks.length,
      source: 'database'
    });
  } catch (error) {
    console.error('âŒ Artworks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artworks'
    });
  }
});

// Single Artwork
app.get('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`í¾¨ GET /api/artworks/${id} - Fetching single artwork`);
    
    const artwork = await db.artwork.findUnique({
      where: { id }
    });
    
    if (!artwork) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found'
      });
    }
    
    res.json({
      success: true,
      data: artwork,
      source: 'database'
    });
  } catch (error) {
    console.error('âŒ Single artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch artwork'
    });
  }
});

// Authentication Endpoints
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('í´ Admin login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('âŒ Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Dashboard Stats (Business metrics)
app.get('/api/dashboard/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('í³Š GET /api/dashboard/stats - Business metrics');
    
    const [totalArtworks, totalCategories, totalUsers, totalAdmins] = await Promise.all([
      db.artwork.count({ where: { isActive: true } }),
      db.category.count({ where: { isActive: true } }),
      db.user.count(),
      db.admin.count()
    ]);
    
    res.json({
      success: true,
      data: {
        totalArtworks,
        totalCategories,
        totalUsers,
        totalAdmins,
        lastUpdated: new Date().toISOString()
      },
      source: 'database'
    });
  } catch (error) {
    console.error('âŒ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

// Image Upload
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('âŒ Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

// Mount your existing routes (will adapt them next)
app.use('/', sitemapRoutes);
app.use('/api/admin', adminRoutes);

// Global error handling
app.use((err, req, res, next) => {
  console.error('íº¨ Global error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start business server
async function startServer() {
  await initDatabase();
  
  const port = process.env.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log('í¾¨ ===============================================');
    console.log('í¾¨ ELOUARATE ART - Business Backend Server');
    console.log(`íº€ Server running on port ${port}`);
    console.log(`í³¡ API Base: http://localhost:${port}/api`);
    console.log(`í¿¥ Health: http://localhost:${port}/api/health`);
    console.log(`ï¿½ï¿½ Artworks: http://localhost:${port}/api/artworks`);
    console.log(`í³‚ Categories: http://localhost:${port}/api/categories`);
    console.log(`í³Š Dashboard: http://localhost:${port}/api/dashboard/stats`);
    console.log(`í´ Admin Login: http://localhost:${port}/api/auth/admin/login`);
    console.log(`í´¥ Environment: ${process.env.NODE_ENV}`);
    console.log(`í·„ï¸ Database: ${dbConnected ? 'Railway PostgreSQL âœ…' : 'Not connected âŒ'}`);
    console.log('âœ… Ready for business operations!');
    console.log('í¾¨ ===============================================');
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('í³´ SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('í³´ SIGINT received, shutting down gracefully');  
  process.exit(0);
});

// Start the business server
startServer().catch(console.error);
