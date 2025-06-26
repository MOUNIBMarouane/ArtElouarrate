import { spawn } from 'child_process';

console.log('🎨 Starting ELOUARATE ART Frontend...');
console.log('📡 Frontend will run on: http://localhost:8080');
console.log('🔗 Backend API endpoint: http://localhost:3000');
console.log('─'.repeat(50));

const frontend = spawn('npm', ['run', 'dev'], { 
  stdio: 'inherit',
  shell: true 
});

frontend.on('close', (code) => {
  console.log(`Frontend exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend...');
  frontend.kill();
  process.exit();
}); 