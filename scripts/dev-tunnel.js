#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Backup original config
const originalConfig = path.join(__dirname, '..', 'next.config.js');
const devConfig = path.join(__dirname, '..', 'next.config.dev.js');
const backupConfig = path.join(__dirname, '..', 'next.config.js.backup');

console.log('🚀 Setting up development environment for tunnel testing...');

// Create backup of original config
if (fs.existsSync(originalConfig) && !fs.existsSync(backupConfig)) {
  fs.copyFileSync(originalConfig, backupConfig);
  console.log('✅ Backed up original next.config.js');
}

// Copy dev config to main config
if (fs.existsSync(devConfig)) {
  fs.copyFileSync(devConfig, originalConfig);
  console.log('✅ Switched to development config');
}

console.log('🌐 Starting development server...');
console.log('📱 After the server starts, we\'ll create the tunnel');
console.log('');

// Start the development server first
const devServer = spawn('npm', ['run', 'dev:mobile'], {
  stdio: 'pipe',
  shell: true
});

let serverReady = false;
let tunnelProcess = null;

// Monitor dev server output
devServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  
  // Check if server is ready
  if (output.includes('Ready') || output.includes('localhost:3000')) {
    if (!serverReady) {
      serverReady = true;
      console.log('🚀 Server is ready! Starting tunnel...');
      
      // Start tunnel after server is ready
      tunnelProcess = spawn('npx', ['cloudflared', 'tunnel', '--url', 'http://localhost:3000'], {
        stdio: 'inherit',
        shell: true
      });
      
      console.log('⚡ Look for the tunnel URL above that looks like: https://xxx-xxx-xxx.trycloudflare.com');
      console.log('📱 Use this URL to access your site on mobile devices');
    }
  }
});

devServer.stderr.on('data', (data) => {
  console.error(data.toString());
});

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🔄 Cleaning up...');
  
  // Kill tunnel process
  if (tunnelProcess) {
    tunnelProcess.kill();
  }
  
  // Kill dev server
  devServer.kill();
  
  // Restore original config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
    console.log('✅ Restored original next.config.js');
  }
  
  process.exit(0);
});

devServer.on('close', (code) => {
  // Kill tunnel process
  if (tunnelProcess) {
    tunnelProcess.kill();
  }
  
  // Restore original config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig);
    fs.unlinkSync(backupConfig);
    console.log('✅ Restored original next.config.js');
  }
  
  process.exit(code);
}); 