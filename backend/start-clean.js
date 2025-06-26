#!/usr/bin/env node

/**
 * 🎨 ELOUARATE ART - Clean Server Startup Script
 * Professional cleanup and server restart
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🎨 ELOUARATE ART - Professional Server Cleanup & Start');
console.log('═'.repeat(60));

// Kill any existing Node processes
async function killExistingProcesses() {
  try {
    console.log('🔄 Checking for existing Node processes...');
    
    // Kill all node processes
    await execAsync('taskkill /F /IM node.exe').catch(() => {
      console.log('📝 No existing Node processes found');
    });
    
    console.log('✅ Process cleanup complete');
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  } catch (error) {
    console.log('📝 Cleanup completed (no processes to kill)');
  }
}

// Set environment variables
function setEnvironment() {
  console.log('⚙️ Setting environment variables...');
  
  process.env.NODE_ENV = 'development';
  process.env.PORT = '3000';
  process.env.FRONTEND_URL = 'http://localhost:8080';
  process.env.DATABASE_URL = 'sqlserver://localhost:1433;database=ElouarateArt;integratedSecurity=true;trustServerCertificate=true;encrypt=false';
  process.env.JWT_SECRET = 'development-jwt-secret-key';
  process.env.JWT_REFRESH_SECRET = 'development-refresh-secret-key';
  
  console.log('✅ Environment configured');
}

// Start the clean server
async function startCleanServer() {
  console.log('🚀 Starting professional clean server...');
  console.log('');
  
  try {
    // Import and start the clean server
    await import('./server-clean.js');
  } catch (error) {
    console.error('❌ Failed to start clean server:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure server-clean.js exists');
    console.log('   2. Check for syntax errors: node -c server-clean.js');
    console.log('   3. Install dependencies: npm install');
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    await killExistingProcesses();
    setEnvironment();
    await startCleanServer();
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

// Run the startup process
main(); 