import { execSync, spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Create .env file with required variables
const envContent = `# Supabase Configuration
SUPABASE_URL=https://hjbhpwkcipvbcvqcjvgh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYmhwd2tjaXB2YmN2cWNqdmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzQ4NjksImV4cCI6MjA2NjM1MDg2OX0.gOfvasaXofrcPzEJZ2kcbU7V2N00iELBKkooxiM3za8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYmhwd2tjaXB2YmN2cWNqdmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDc3NDg2OSwiZXhwIjoyMDY2MzUwODY5fQ.luSb9-9HpyiFcvpJe7YI1oxK0uUiGeJck5RmWRGI864

# Database Configuration
DATABASE_URL="postgresql://postgres.hjbhpwkcipvbcvqcjvgh:76P9wUo4MhPkgHKN@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&schema=public"
POSTGRES_URL="postgresql://postgres.hjbhpwkcipvbcvqcjvgh:76P9wUo4MhPkgHKN@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
POSTGRES_PRISMA_URL="postgresql://postgres.hjbhpwkcipvbcvqcjvgh:76P9wUo4MhPkgHKN@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&schema=public"

# Application Configuration
NODE_ENV=development
PORT=3000
`;

console.log('🔧 Setting up environment...');
writeFileSync('.env', envContent);

console.log('📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Prisma generate failed, continuing...');
}

console.log('🚀 Starting server...');
const server = spawn('npx', ['vercel', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill();
  process.exit();
}); 