#!/usr/bin/env node

/**
 * 🎨 ELOUARATE ART - Professional Quick Start
 * 
 * This script quickly starts your professional server with optimal settings
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🎨 ELOUARATE ART - Professional Quick Start');
console.log('═'.repeat(50));

const BACKEND_DIR = './backend';

// Check if backend exists
if (!existsSync(BACKEND_DIR)) {
  console.error('❌ Backend directory not found!');
  console.error('   Make sure you are in the project root directory.');
  process.exit(1);
}

// Check if professional files exist
const professionalFiles = [
  `${BACKEND_DIR}/server-pro.js`,
  `${BACKEND_DIR}/lib/cache-pro.js`,
  `${BACKEND_DIR}/services/auth-pro.js`
];

const hasProfessionalFiles = professionalFiles.some(file => existsSync(file));

if (!hasProfessionalFiles) {
  console.log('⚠️  Professional files not found. Starting current server...');
  
  // Start current server
  const server = spawn('node', ['server.js'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '3001'
    }
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
  });

  console.log('🚀 Starting current server on http://localhost:3001');
  console.log('💡 Run upgrade-to-professional.js to get all professional features');
  
} else {
  console.log('✅ Professional features detected');
  console.log('🚀 Starting professional server...');
  
  // Start professional server
  const server = spawn('node', ['server-pro.js'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '3001'
    }
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start professional server:', error.message);
    console.log('💡 Falling back to standard server...');
    
    // Fallback to standard server
    const fallbackServer = spawn('node', ['server.js'], {
      cwd: BACKEND_DIR,
      stdio: 'inherit'
    });
  });

  console.log('🎯 Professional server starting with:');
  console.log('   ⚡ Multi-core clustering');
  console.log('   🔒 Enterprise security');
  console.log('   💾 Advanced caching');
  console.log('   📊 Performance monitoring');
  console.log('');
  console.log('🌐 Server will be available at: http://localhost:3001');
  console.log('🏥 Health check: http://localhost:3001/api/health');
  console.log('📈 System stats: http://localhost:3001/api/stats');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
}); 