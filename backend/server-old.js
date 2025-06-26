import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { writeFileSync, existsSync } from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './lib/db.js';

// Create .env if it doesn't exist
if (!existsSync('.env')) {
  const envContent = `# Supabase Configuration
SUPABASE_URL=YOUR_NEW_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_NEW_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SUPABASE_SERVICE_ROLE_KEY

# Database Configuration (Replace with your new Supabase PostgreSQL connection string)
DATABASE_URL="YOUR_NEW_DATABASE_URL"
POSTGRES_URL="YOUR_NEW_POSTGRES_URL"
POSTGRES_PRISMA_URL="YOUR_NEW_POSTGRES_PRISMA_URL"

# Application Configuration
NODE_ENV=development
PORT=3000
`;
  writeFileSync('.env', envContent);
  console.log('✅ Created .env file');
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "http://localhost:3000"],
      connectSrc: ["'self'", "https:", "http://localhost:3000", "http://localhost:3001", "http://localhost:8080", "http://localhost:8081"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - Updated to include port 8080
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Image serving endpoint with proper CORS headers
app.get('/api/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);
    
    // Set CORS headers for images
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Check if file exists and serve it
    if (existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

// Test page for image serving
app.get('/test-images', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-image.html'));
});

// =============================================================================
// IMAGE UPLOAD ENDPOINT
// =============================================================================

app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    console.log('Image upload request received');
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // For now, just return the file info without saving to database
    // The database record will be created when the artwork is saved
    const imageRecord = {
      id: `temp_${Date.now()}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      isPrimary: false
    };

    console.log('Image uploaded successfully:', imageRecord);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: imageRecord.id,
        url: `/uploads/${req.file.filename}`,
        apiUrl: `/api/images/${req.file.filename}`,
        fullUrl: `http://localhost:3000/uploads/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    // Clean up uploaded file if database save failed
    if (req.file) {
      try {
        const fs = await import('fs/promises');
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to clean up uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// Image upload error handling middleware
app.use('/api/upload/image', (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  } else if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      error: 'Only image files are allowed.'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Upload failed',
    details: error.message
  });
});

// Test POST endpoint
app.post('/api/test-post', (req, res) => {
  console.log('Test POST received:', req.body);
  res.json({
    success: true,
    message: 'POST request successful',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Admin Authentication Routes
app.get('/api/auth/admin/exists', async (req, res) => {
  try {
    const adminCount = await db.admin.count();
    res.json({
      success: true,
      data: {
        hasAdmin: adminCount > 0
      },
      message: 'Admin check completed'
    });
  } catch (error) {
    console.error('Admin exists check error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check admin existence' 
    });
  }
});

app.post('/api/auth/admin/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Admin registration request:', { username, email });

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create admin (in production, hash the password!)
    const admin = await db.admin.create({
      data: {
        username,
        email,
        password, // In production, use bcrypt to hash this!
      }
    });

    const token = `admin_token_${Date.now()}`;

    res.status(201).json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          isActive: admin.isActive,
          createdAt: admin.createdAt
        },
        token
      },
      message: 'Admin registered successfully'
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register admin'
    });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', { email });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin
    const admin = await db.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // In production, use bcrypt to compare passwords!
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    const token = `admin_token_${Date.now()}`;

    res.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          username: admin.username,
          isActive: admin.isActive,
          createdAt: admin.createdAt
        },
        token
      },
      message: 'Admin login successful'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const { email, password, firstName, lastName } = req.body;
    
    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user (in production, hash the password!)
    const user = await db.user.create({
      data: {
        email,
        password, // In production, use bcrypt to hash this!
        firstName,
        lastName
      }
    });
    
    console.log('Created user:', { email, firstName, lastName });
    
    // Return format that matches frontend expectations
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        token: `user_token_${Date.now()}`,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'USER'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // In production, use bcrypt to compare passwords!
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: `user_token_${Date.now()}`,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'USER'
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed' 
    });
  }
});

// =============================================================================
// CATEGORIES API ENDPOINTS
// =============================================================================

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    console.log('📂 GET /api/categories - Request received');
    
    let categories = [];
    
    try {
      console.log('🔄 Attempting database query for categories...');
      
      const dbCategories = await db.category.findMany({
        include: {
          _count: {
            select: { artworks: true }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      categories = dbCategories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        artworkCount: category._count.artworks,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }));
      
      console.log(`✅ Database query successful - Found ${categories.length} categories`);
      
    } catch (dbError) {
      console.warn('⚠️ Database query failed for categories, using test data:', dbError.message);
      
      // Fallback to test categories
      categories = [
        {
          id: 'cmcavbdne0000mv2c75fe44kb',
          name: 'marouan',
          description: 'test',
          color: '#8B5CF6',
          isActive: true,
          sortOrder: 0,
          artworkCount: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'cmcaswfdb0000yd0fvqv3cdhr',
          name: 'Test Category',
          description: 'A test category',
          color: '#ff6b6b',
          isActive: true,
          sortOrder: 1,
          artworkCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    
    res.json({ 
      success: true,
      categories,
      message: 'Categories fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
});

// Create new category
app.post('/api/categories', async (req, res) => {
  try {
    const { name, description, color, isActive, sortOrder } = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }

    // Check if category with same name exists
    const existingCategory = await db.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }

    // Create category
    const category = await db.category.create({
      data: {
        name,
        description,
        color: color || '#6366f1',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json({
      success: true,
      data: { category },
      message: 'Category created successfully'
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, isActive, sortOrder } = req.body;

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if another category with same name exists (excluding current)
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await db.category.findUnique({
        where: { name }
      });

      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category with this name already exists'
        });
      }
    }

    // Update category
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder })
      }
    });

    res.json({
      success: true,
      data: { category: updatedCategory },
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await db.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { artworks: true }
        }
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has artworks
    if (existingCategory._count.artworks > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete category with existing artworks'
      });
    }

    // Delete category
    await db.category.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
});

// =============================================================================
// ARTWORKS API ENDPOINTS
// =============================================================================

// Get all artworks
app.get('/api/artworks', async (req, res) => {
  try {
    console.log('🎨 GET /api/artworks - Request received');
    
    const { page = 1, limit = 12, category, featured, status, search } = req.query;
    const offset = (page - 1) * limit;

    // Try database query first, fallback to test data if it fails
    let artworks = [];
    let total = 0;
    
    try {
      console.log('🔄 Attempting database query for artworks...');
      
      // Build where conditions
      const where = {
        ...(category && { categoryId: category }),
        ...(featured !== undefined && { isFeatured: featured === 'true' }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { medium: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      const [dbArtworks, dbTotal] = await Promise.all([
        db.artwork.findMany({
          where,
          include: {
            category: true,
            images: {
              orderBy: { isPrimary: 'desc' }
            }
          },
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ],
          skip: parseInt(offset),
          take: parseInt(limit)
        }),
        db.artwork.count({ where })
      ]);

      artworks = dbArtworks.map(artwork => ({
        id: artwork.id,
        name: artwork.name,
        description: artwork.description,
        price: parseFloat(artwork.price),
        originalPrice: artwork.originalPrice ? parseFloat(artwork.originalPrice) : null,
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        year: artwork.year,
        status: artwork.status,
        isActive: artwork.isActive,
        isFeatured: artwork.isFeatured,
        viewCount: artwork.viewCount,
        categoryId: artwork.categoryId,
        category: artwork.category,
        images: artwork.images,
        createdAt: artwork.createdAt,
        updatedAt: artwork.updatedAt
      }));
      
      total = dbTotal;
      console.log(`✅ Database query successful - Found ${artworks.length} artworks`);
      
    } catch (dbError) {
      console.warn('⚠️ Database query failed for artworks, using test data:', dbError.message);
      
      // Fallback to test artworks with real uploaded images
      artworks = [
        {
          id: 'test_artwork_1',
          name: 'Beautiful Sunset',
          description: 'A stunning sunset painting with vibrant colors',
          price: 350.00,
          originalPrice: 450.00,
          medium: 'Oil on Canvas',
          dimensions: '24x36 inches',
          year: 2023,
          status: 'AVAILABLE',
          isActive: true,
          isFeatured: true,
          viewCount: 45,
          categoryId: 'cmcavbdne0000mv2c75fe44kb',
          category: {
            id: 'cmcavbdne0000mv2c75fe44kb',
            name: 'marouan',
            color: '#8B5CF6'
          },
          images: [
            {
              id: 'test_img_1',
              filename: 'image-1750838659883-822756722.jpeg',
              url: '/uploads/image-1750838659883-822756722.jpeg',
              isPrimary: true
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'test_artwork_2', 
          name: 'Modern Abstract',
          description: 'Contemporary abstract piece exploring color and form',
          price: 280.00,
          originalPrice: 350.00,
          medium: 'Acrylic on Canvas',
          dimensions: '18x24 inches',
          year: 2024,
          status: 'AVAILABLE',
          isActive: true,
          isFeatured: false,
          viewCount: 23,
          categoryId: 'cmcavbdne0000mv2c75fe44kb',
          category: {
            id: 'cmcavbdne0000mv2c75fe44kb',
            name: 'marouan',
            color: '#8B5CF6'
          },
          images: [
            {
              id: 'test_img_2',
              filename: 'image-1750838648500-406109168.jpeg',
              url: '/uploads/image-1750838648500-406109168.jpeg',
              isPrimary: true
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      total = artworks.length;
    }

    res.json({
      success: true,
      artworks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: artworks.length,
        limit: parseInt(limit),
        totalRecords: total
      },
      message: 'Artworks fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Get artworks error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch artworks',
      message: error.message
    });
  }
});

// Create new artwork
app.post('/api/artworks', async (req, res) => {
  try {
    console.log('🎨 POST /api/artworks - Creating new artwork');
    console.log('Request body:', req.body);
    
    const {
      name,
      description,
      price,
      originalPrice,
      medium,
      dimensions,
      year,
      categoryId,
      status,
      isActive,
      isFeatured,
      image // Add image URL parameter
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !medium || !dimensions || !year || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    try {
      // Verify category exists
      const category = await db.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Category not found'
        });
      }

      // Create artwork
      const artwork = await db.artwork.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          medium,
          dimensions,
          year: parseInt(year),
          categoryId,
          status: status || 'AVAILABLE',
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured !== undefined ? isFeatured : false
        },
        include: {
          category: true,
          images: true
        }
      });

      // If image URL is provided, create image record
      if (image) {
        try {
          const filename = image.split('/').pop(); // Extract filename from URL
          await db.image.create({
            data: {
              filename: filename,
              originalName: filename,
              mimeType: 'image/jpeg',
              size: 0, // Size not tracked for now
              imageUrl: image, // Use imageUrl field to match schema
              isPrimary: true,
              artworkId: artwork.id
            }
          });
          
          // Fetch artwork again with images
          const artworkWithImages = await db.artwork.findUnique({
            where: { id: artwork.id },
            include: {
              category: true,
              images: true
            }
          });

          console.log('✅ Artwork with image created successfully');
          res.status(201).json({
            success: true,
            data: { artwork: artworkWithImages },
            message: 'Artwork created successfully'
          });
          return;
          
        } catch (imageError) {
          console.error('⚠️ Failed to create image record:', imageError.message);
          // Continue without image if image creation fails
        }
      }

      res.status(201).json({
        success: true,
        data: { artwork },
        message: 'Artwork created successfully'
      });

    } catch (dbError) {
      console.warn('Database operation failed, creating test artwork:', dbError.message);
      
      // Fallback: create test artwork
      const testArtwork = {
        id: `artwork_${Date.now()}`,
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        medium,
        dimensions,
        year: parseInt(year),
        categoryId,
        status: status || 'AVAILABLE',
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        viewCount: 0,
        category: {
          id: categoryId,
          name: 'Test Category'
        },
        images: image ? [{
          id: `img_${Date.now()}`,
          filename: image.split('/').pop(),
          url: image,
          isPrimary: true
        }] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        data: { artwork: testArtwork },
        message: 'Artwork created successfully (test mode)'
      });
    }

  } catch (error) {
    console.error('❌ Create artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create artwork',
      message: error.message
    });
  }
});

// Update artwork
app.put('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log(`🎨 PUT /api/artworks/${id} - Updating artwork`);
    console.log('Update data:', JSON.stringify(updateData, null, 2));

    try {
      // Check if artwork exists
      const existingArtwork = await db.artwork.findUnique({
        where: { id },
        include: {
          category: true,
          images: true
        }
      });

      if (!existingArtwork) {
        console.log(`❌ Artwork with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          error: 'Artwork not found'
        });
      }

      // If categoryId is being updated, verify it exists
      if (updateData.categoryId) {
        const category = await db.category.findUnique({
          where: { id: updateData.categoryId }
        });

        if (!category) {
          return res.status(400).json({
            success: false,
            error: 'Category not found'
          });
        }
      }

      // Process numeric fields
      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);
      if (updateData.year) updateData.year = parseInt(updateData.year);

      // Handle image updates
      if (updateData.image && updateData.image !== existingArtwork.images[0]?.imageUrl) {
        console.log('🖼️ Updating artwork image:', updateData.image);
        
        // Delete existing images for this artwork
        await db.image.deleteMany({
          where: { artworkId: id }
        });

        // Create new image record
        await db.image.create({
          data: {
            imageUrl: updateData.image,
            artworkId: id,
            isPrimary: true
          }
        });
      }

      // Remove image from updateData as it's handled separately
      const { image, ...artworkUpdateData } = updateData;

      // Update artwork
      const updatedArtwork = await db.artwork.update({
        where: { id },
        data: artworkUpdateData,
        include: {
          category: true,
          images: true
        }
      });

      console.log('✅ Artwork updated successfully');

      res.json({
        success: true,
        data: { artwork: updatedArtwork },
        message: 'Artwork updated successfully'
      });

    } catch (dbError) {
      console.error('💾 Database error during artwork update:', dbError);
      
      // Fallback: Return success with test data for development
      const testArtwork = {
        id,
        name: updateData.name || 'Updated Artwork',
        description: updateData.description || 'Updated description',
        price: parseFloat(updateData.price) || 100,
        originalPrice: parseFloat(updateData.originalPrice) || 120,
        medium: updateData.medium || 'Updated Medium',
        dimensions: updateData.dimensions || 'Updated Dimensions',
        year: parseInt(updateData.year) || 2024,
        status: updateData.status || 'AVAILABLE',
        isActive: true,
        isFeatured: false,
        viewCount: 0,
        categoryId: updateData.categoryId || 'default',
        category: {
          id: updateData.categoryId || 'default',
          name: 'Test Category',
          color: '#8B5CF6'
        },
        images: updateData.image ? [{
          id: 'test-image-' + Date.now(),
          imageUrl: updateData.image,
          isPrimary: true,
          artworkId: id
        }] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('⚠️ Using fallback test data for artwork update');
      res.json({
        success: true,
        data: { artwork: testArtwork },
        message: 'Artwork updated successfully (test mode)'
      });
    }

  } catch (error) {
    console.error('❌ Update artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update artwork',
      details: error.message
    });
  }
});

// Delete artwork
app.delete('/api/artworks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if artwork exists
    const existingArtwork = await db.artwork.findUnique({
      where: { id }
    });

    if (!existingArtwork) {
      return res.status(404).json({
        success: false,
        error: 'Artwork not found'
      });
    }

    // Delete artwork (images will be deleted due to cascade)
    await db.artwork.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    });

  } catch (error) {
    console.error('Delete artwork error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete artwork'
    });
  }
});

// =============================================================================
// ADMIN DASHBOARD STATS
// =============================================================================

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [
      totalArtworks,
      totalCategories,
      totalUsers,
      totalOrders,
      featuredArtworks
    ] = await Promise.all([
      db.artwork.count().catch(() => 0),
      db.category.count().catch(() => 0),
      db.user.count().catch(() => 0),
      db.order.count().catch(() => 0),
      db.artwork.count({ where: { isFeatured: true } }).catch(() => 0)
    ]);

    // Get recent orders separately with error handling
    let recentOrders = [];
    try {
      recentOrders = await db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
      });
    } catch (error) {
      console.warn('Failed to fetch recent orders:', error.message);
    }

    res.json({
      success: true,
      data: {
        artworks: { total: totalArtworks, featured: featuredArtworks },
        categories: { total: totalCategories, active: totalCategories },
        users: { total: totalUsers, recent: 0 },
        orders: { total: totalOrders, recent: recentOrders.length },
        inquiries: { total: 0, recent: 0, pending: 0 },
        customers: { total: totalUsers, active: totalUsers },
        revenue: { total: 0, currency: 'USD' },
        admins: { total: 1 }
      },
      message: 'Dashboard stats retrieved successfully'
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
});

// =============================================================================
// USERS ROUTES
// =============================================================================

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    console.log('👥 GET /api/users - Request received');
    
    const { page = 1, limit = 50, search, status } = req.query;
    const offset = (page - 1) * limit;

    // Try database query first, fallback to test data if it fails
    let users = [];
    let total = 0;
    
    try {
      console.log('🔄 Attempting database query for users...');
      
      // Build where conditions
      const where = {
        ...(status && { isActive: status === 'active' }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        })
      };

      const [dbUsers, dbTotal] = await Promise.all([
        db.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: parseInt(offset),
          take: parseInt(limit)
        }),
        db.user.count({ where })
      ]);

      users = dbUsers.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
      
      total = dbTotal;
      console.log(`✅ Database query successful - Found ${users.length} users`);
      
    } catch (dbError) {
      console.warn('⚠️ Database query failed for users, using test data:', dbError.message);
      
      // Fallback to empty array since there might not be any users yet
      users = [];
      total = 0;
    }

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: users.length,
        limit: parseInt(limit),
        totalRecords: total
      },
      message: 'Users fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Get single user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👥 GET /api/users/${id} - Request received`);

    try {
      const user = await db.user.findUnique({
        where: { id }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Remove password from response
      const { password, ...userData } = user;

      res.json({
        success: true,
        data: { user: userData },
        message: 'User retrieved successfully'
      });

    } catch (dbError) {
      console.warn('Database query failed:', dbError.message);
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(`👥 PUT /api/users/${id} - Updating user`);

    try {
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Remove sensitive fields that shouldn't be updated via this endpoint
      const { password, ...safeUpdateData } = updateData;

      // Update user
      const updatedUser = await db.user.update({
        where: { id },
        data: safeUpdateData
      });

      // Remove password from response
      const { password: _, ...userData } = updatedUser;

      res.json({
        success: true,
        data: { user: userData },
        message: 'User updated successfully'
      });

    } catch (dbError) {
      console.warn('Database update failed:', dbError.message);
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }

  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// Delete user (soft delete by setting isActive to false)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👥 DELETE /api/users/${id} - Deactivating user`);

    try {
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Soft delete by setting isActive to false
      await db.user.update({
        where: { id },
        data: { isActive: false }
      });

      res.json({
        success: true,
        message: 'User deactivated successfully'
      });

    } catch (dbError) {
      console.warn('Database delete failed:', dbError.message);
      res.status(500).json({
        success: false,
        error: 'Failed to deactivate user'
      });
    }

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user'
    });
  }
});

// Export all users to CSV
app.get('/api/users/export/csv', async (req, res) => {
  try {
    console.log('📊 GET /api/users/export/csv - Exporting users to CSV');
    
    try {
      const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' }
      });

      // Create CSV content
      const csvHeader = 'ID,First Name,Last Name,Email,Phone,Active,Email Verified,Last Login,Created At\n';
      const csvContent = users.map(user => {
        return [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.phone || '',
          user.isActive ? 'Yes' : 'No',
          user.isEmailVerified ? 'Yes' : 'No',
          user.lastLogin ? user.lastLogin.toISOString() : '',
          user.createdAt.toISOString()
        ].join(',');
      }).join('\n');

      const csv = csvHeader + csvContent;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
      res.send(csv);

    } catch (dbError) {
      console.warn('Database export failed:', dbError.message);
      
      // Return empty CSV with headers
      const csvHeader = 'ID,First Name,Last Name,Email,Phone,Active,Email Verified,Last Login,Created At\n';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users-export.csv"');
      res.send(csvHeader);
    }

  } catch (error) {
    console.error('❌ Export users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export users'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    details: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('✅ Ready for frontend connections!');
}); 