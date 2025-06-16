#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Print the banner
function printBanner() {
  console.log(`${colors.cyan}${colors.bright}
  ██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗     
  ██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗    
  ██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║    
  ██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║    
  ██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝    
  ╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     
                                                          
  ███████╗██╗  ██╗████████╗██████╗  █████╗  ██████╗████████╗ ██████╗ ██████╗ 
  ██╔════╝╚██╗██╔╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
  █████╗   ╚███╔╝    ██║   ██████╔╝███████║██║        ██║   ██║   ██║██████╔╝
  ██╔══╝   ██╔██╗    ██║   ██╔══██╗██╔══██║██║        ██║   ██║   ██║██╔══██╗
  ███████╗██╔╝ ██╗   ██║   ██║  ██║██║  ██║╚██████╗   ██║   ╚██████╔╝██║  ██║
  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
${colors.reset}`);

  console.log(`${colors.yellow}Extract Dialog elements from Discord HTML files${colors.reset}`);
  console.log(`${colors.dim}v1.0.0 - Created for SingleFile exports${colors.reset}\n`);
}

// Print usage info
function printUsage() {
  console.log(`${colors.bright}USAGE:${colors.reset}`);
  console.log(`  node extract-dialog-cli.js [options]`);
  
  console.log(`\n${colors.bright}OPTIONS:${colors.reset}`);
  console.log(`  --input, -i  ${colors.dim}Input HTML file path${colors.reset}`);
  console.log(`  --output, -o ${colors.dim}Output HTML file path${colors.reset}`);
  console.log(`  --method, -m ${colors.dim}Extraction method: final|basic|advanced|simple${colors.reset}`);
  console.log(`  --help, -h   ${colors.dim}Show this help message${colors.reset}`);
  
  console.log(`\n${colors.bright}EXAMPLES:${colors.reset}`);
  console.log(`  node extract-dialog-cli.js --input "discord.html" --output "extracted.html" --method final`);
  console.log(`  node extract-dialog-cli.js -i "discord.html" -m simple\n`);
  
  console.log(`${colors.bright}EXTRACTION METHODS:${colors.reset}`);
  console.log(`  ${colors.green}final${colors.reset}    ${colors.dim}(Recommended) Best balance of size and visual fidelity${colors.reset}`);
  console.log(`  ${colors.yellow}basic${colors.reset}    ${colors.dim}Original extraction method with CSS/JS filtering${colors.reset}`);
  console.log(`  ${colors.yellow}advanced${colors.reset} ${colors.dim}Advanced extraction with custom selectors${colors.reset}`);
  console.log(`  ${colors.yellow}simple${colors.reset}   ${colors.dim}Simple regex-based extraction${colors.reset}`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    output: null,
    method: 'final',
    help: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
    else if (arg === '--input' || arg === '-i') {
      options.input = args[++i];
    }
    else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    }
    else if (arg === '--method' || arg === '-m') {
      const method = args[++i];
      if (['final', 'basic', 'advanced', 'simple'].includes(method)) {
        options.method = method;
      } else {
        console.error(`${colors.red}Invalid method: ${method}${colors.reset}`);
        console.error(`${colors.dim}Valid methods: final, basic, advanced, simple${colors.reset}`);
        process.exit(1);
      }
    }
  }
  
  return options;
}

// Map method names to script files
function getScriptForMethod(method) {
  const methodMap = {
    'final': 'extract-dialog-final.js',
    'basic': 'extract-discord-div.js',
    'advanced': 'extract-advanced.js',
    'simple': 'extract-dialog-simple.js'
  };
  
  return methodMap[method] || 'extract-dialog-final.js';
}

// Execute the extraction
function runExtraction(options) {
  const script = getScriptForMethod(options.method);
  
  console.log(`${colors.cyan}Starting extraction using ${colors.bright}${script}${colors.reset}\n`);
  
  try {
    // Build the command arguments
    let cmd = `node ${script}`;
    
    if (options.input) {
      cmd += ` "${options.input}"`;
      
      if (options.output) {
        cmd += ` "${options.output}"`;
      }
    }
    
    // Execute the command
    execSync(cmd, { stdio: 'inherit' });
    
    console.log(`\n${colors.green}${colors.bright}Extraction completed successfully!${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}Error during extraction:${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Main function
function main() {
  printBanner();
  
  const options = parseArgs();
  
  if (options.help) {
    printUsage();
    return;
  }
  
  runExtraction(options);
}

// Run the main function
main(); 