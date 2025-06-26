#!/usr/bin/env node

/**
 * 🎨 ELOUARATE ART - Professional Server
 * High-performance, enterprise-grade server with advanced features
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';
import { config } from 'dotenv';
import morgan from 'morgan';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const numCPUs = NODE_ENV === 'production' ? cpus().length : 1;

// =============================================================================
// CLUSTERING FOR HIGH PERFORMANCE
// =============================================================================

if (cluster.isPrimary && numCPUs > 1) {
  console.log('🎨 ELOUARATE ART - Professional Server v2.0');
  console.log('═'.repeat(60));
  console.log(`🚀 Master process ${process.pid} is running`);
  console.log(`🔄 Forking ${numCPUs} worker processes...`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`⚡ Performance: Multi-core clustering enabled`);
  console.log('');

  // Worker tracking
  const workers = new Map();

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers.set(worker.id, {
      worker,
      started: new Date(),
      restarts: 0,
      requests: 0
    });
    console.log(`👷 Worker ${worker.id} (PID: ${worker.process.pid}) started`);
  }

  // Handle worker deaths
  cluster.on('exit', (worker, code, signal) => {
    const workerInfo = workers.get(worker.id);
    console.log(`💀 Worker ${worker.id} died (Code: ${code}, Signal: ${signal})`);
    
    if (workerInfo && workerInfo.restarts < 5) {
      workerInfo.restarts++;
      const newWorker = cluster.fork();
      workers.set(newWorker.id, {
        worker: newWorker,
        started: new Date(),
        restarts: workerInfo.restarts,
        requests: 0
      });
      console.log(`🔄 New worker ${newWorker.id} started (Restart #${workerInfo.restarts})`);
    } else {
      console.error(`❌ Worker crashed too many times, not restarting`);
    }
    workers.delete(worker.id);
  });

  // Handle worker ready
  cluster.on('online', (worker) => {
    console.log(`✅ Worker ${worker.id} is online`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}, shutting down cluster...`);
    for (const [id, workerInfo] of workers) {
      workerInfo.worker.disconnect();
    }
    setTimeout(() => {
      for (const [id, workerInfo] of workers) {
        workerInfo.worker.kill();
      }
      process.exit(0);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

} else {
  // =============================================================================
  // WORKER PROCESS - ACTUAL SERVER
  // =============================================================================

  const app = express();

  // Trust proxy for load balancers
  app.set('trust proxy', 1);

  // Create logs directory
  const logsDir = path.join(__dirname, 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }

  // =============================================================================
  // ADVANCED LOGGING
  // =============================================================================

  // Custom token for response time in microseconds
  morgan.token('response-time-us', (req, res) => {
    if (!req._startTime) return '-';
    const delta = process.hrtime(req._startTime);
    return Math.round((delta[0] * 1e3) + (delta[1] * 1e-6)) + 'ms';
  });

  // Custom token for memory usage
  morgan.token('memory', () => {
    const used = process.memoryUsage();
    return `${Math.round(used.heapUsed / 1024 / 1024)}MB`;
  });

  // Development logging
  if (NODE_ENV === 'development') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time-us [:memory]', {
      stream: process.stdout
    }));
  }

  // Production logging
  if (NODE_ENV === 'production') {
    const accessLogStream = createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
    app.use(morgan('combined', {
      stream: accessLogStream,
      skip: (req, res) => res.statusCode < 400
    }));
  }

  // =============================================================================
  // SECURITY MIDDLEWARE
  // =============================================================================

  // Advanced helmet configuration
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // =============================================================================
  // CORS CONFIGURATION
  // =============================================================================

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['X-Total-Count', 'X-Request-ID']
  }));

  // =============================================================================
  // PERFORMANCE MIDDLEWARE
  // =============================================================================

  // High-performance compression
  app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    }
  }));

  // Request ID and timing
  app.use((req, res, next) => {
    req.id = Math.random().toString(36).substr(2, 9);
    req._startTime = process.hrtime();
    res.setHeader('X-Request-ID', req.id);
    next();
  });

  // =============================================================================
  // RATE LIMITING
  // =============================================================================

  const createLimiter = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { 
      success: false,
      error: message,
      retryAfter: Math.round(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      console.warn(`🚨 Rate limit exceeded: ${req.ip} on ${req.path}`);
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.round(windowMs / 1000),
        timestamp: new Date().toISOString()
      });
    }
  });

  // Different limits for different endpoints
  const generalLimiter = createLimiter(15 * 60 * 1000, 1000, 'Too many requests');
  const apiLimiter = createLimiter(15 * 60 * 1000, 500, 'API rate limit exceeded');
  const authLimiter = createLimiter(15 * 60 * 1000, 10, 'Too many auth attempts');
  const uploadLimiter = createLimiter(60 * 1000, 20, 'Upload rate limit exceeded');

  app.use(generalLimiter);
  app.use('/api', apiLimiter);
  app.use('/api/auth', authLimiter);
  app.use('/api/upload', uploadLimiter);

  // =============================================================================
  // BODY PARSING
  // =============================================================================

  app.use(express.json({ 
    limit: '50mb',
    strict: true 
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '50mb' 
  }));

  // =============================================================================
  // STATIC FILES WITH CACHING
  // =============================================================================

  app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    cacheControl: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.webp')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));

  // =============================================================================
  // HEALTH MONITORING
  // =============================================================================

  // Health check endpoint
  app.get('/health', (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      success: true,
      data: {
        status: 'healthy',
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
        },
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
        worker: cluster.worker?.id || 'single',
        pid: process.pid
      }
    });
  });

  // Performance metrics endpoint
  app.get('/metrics', (req, res) => {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      success: true,
      data: {
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        },
        memory: {
          heapUsed: memoryUsage.heapUsed,
          heapTotal: memoryUsage.heapTotal,
          external: memoryUsage.external,
          rss: memoryUsage.rss
        },
        uptime: process.uptime(),
        version: process.version,
        arch: process.arch,
        platform: process.platform
      }
    });
  });

  // =============================================================================
  // API ROUTES MOUNTING
  // =============================================================================

  // Import and mount API routes
  try {
    const { default: apiRoutes } = await import('./api/index.js');
    app.use('/api', apiRoutes);
    console.log('✅ API routes mounted successfully');
  } catch (error) {
    console.error('❌ Failed to load API routes:', error.message);
  }

  // =============================================================================
  // FRONTEND SERVING
  // =============================================================================

  // Serve frontend build
  const frontendPath = path.join(__dirname, '../Frontend/dist');
  if (existsSync(frontendPath)) {
    app.use(express.static(frontendPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true
    }));

    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    // Development mode - show API documentation
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>🎨 ELOUARATE ART - Professional API</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                margin: 0; padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; min-height: 100vh; 
              }
              .container { max-width: 1000px; margin: 0 auto; }
              .card { 
                background: rgba(255,255,255,0.1); 
                border-radius: 15px; padding: 30px; margin: 20px 0; 
                backdrop-filter: blur(10px); 
              }
              h1 { margin: 0 0 20px 0; font-size: 2.5rem; }
              .status { 
                background: #4ade80; padding: 5px 15px; 
                border-radius: 20px; display: inline-block; 
                margin: 10px 0; font-weight: bold; 
              }
              .grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 20px; 
              }
              .endpoint { 
                background: rgba(0,0,0,0.2); padding: 15px; 
                border-radius: 8px; margin: 10px 0; 
              }
              a { color: #93c5fd; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <h1>🎨 ELOUARATE ART</h1>
                <div class="status">🚀 Professional Server v2.0</div>
                <p>High-performance, enterprise-grade server with clustering, security, and monitoring.</p>
              </div>
              
              <div class="grid">
                <div class="card">
                  <h3>🔗 System Endpoints</h3>
                  <div class="endpoint">
                    <a href="/health">/health</a> - Health check<br>
                    <a href="/metrics">/metrics</a> - Performance metrics
                  </div>
                </div>
                
                <div class="card">
                  <h3>🚀 Performance Features</h3>
                  <ul>
                    <li>Multi-core clustering</li>
                    <li>Advanced rate limiting</li>
                    <li>High-performance compression</li>
                    <li>Security headers</li>
                    <li>Request monitoring</li>
                    <li>Memory optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
    });
  }

  // =============================================================================
  // ERROR HANDLING
  // =============================================================================

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  });

  // Global error handler
  app.use((error, req, res, next) => {
    console.error(`🚨 Error on ${req.method} ${req.path}:`, error);
    
    const statusCode = error.statusCode || 500;
    const message = NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message;

    res.status(statusCode).json({
      success: false,
      error: message,
      requestId: req.id,
      timestamp: new Date().toISOString(),
      ...(NODE_ENV === 'development' && { stack: error.stack })
    });
  });

  // =============================================================================
  // SERVER STARTUP
  // =============================================================================

  const server = app.listen(PORT, () => {
    const workerId = cluster.worker?.id || 'single';
    console.log(`🎨 ELOUARATE ART Server`);
    console.log(`═${'═'.repeat(40)}`);
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`👷 Worker: ${workerId} (PID: ${process.pid})`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`⚡ Performance: Optimized`);
    console.log(`🔒 Security: Enterprise-grade`);
    console.log(`✅ Ready for connections!`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Worker ${process.pid} received ${signal}`);
    server.close(() => {
      console.log('✅ Worker shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app; 