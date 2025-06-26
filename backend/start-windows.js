#!/usr/bin/env node

/**
 * 🎨 ELOUARATE ART - Windows Compatible Start Script
 * This script starts your server with Windows compatibility
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🎨 ELOUARATE ART - Windows Compatible Start');
console.log('═'.repeat(50));

// Set environment variables for Windows
process.env.NODE_ENV = 'development';
process.env.PORT = '3001';

// Check which server file exists and start it
let serverFile = 'server.js';
let serverType = 'Current';

if (existsSync('./server-pro.js')) {
  serverFile = 'server-pro.js';
  serverType = 'Professional';
} else if (existsSync('./api/index-enhanced.js')) {
  serverFile = 'api/index-enhanced.js';
  serverType = 'Enhanced';
}

console.log(`🚀 Starting ${serverType} Server...`);
console.log(`📁 Using: ${serverFile}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${process.env.PORT}`);
console.log('');

// Start the server
const server = spawn('node', [serverFile], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3001',
    DATABASE_URL: process.env.DATABASE_URL || 'sqlserver://localhost:1433;database=ElouarateArt;integratedSecurity=true;trustServerCertificate=true;encrypt=false'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('   1. Make sure you are in the backend directory');
  console.log('   2. Run: npm install');
  console.log('   3. Check if server.js exists');
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.log(`\n❌ Server exited with code ${code}`);
  }
});

console.log('🌐 Server will be available at: http://localhost:3001');
console.log('🏥 Health check: http://localhost:3001/api/health');
console.log('📊 Statistics: http://localhost:3001/api/stats');
console.log('');
console.log('⏹️  Press Ctrl+C to stop the server');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  server.kill('SIGTERM');
  process.exit(0);
}); 