const fs = require('fs');
const path = require('path');

// Handle file paths with special characters
function normalizePath(filePath) {
  try {
    return decodeURIComponent(filePath);
  } catch (e) {
    return filePath;
  }
}

// File paths
const inputPath = normalizePath(process.argv[2] || 
  'C:/Users/ASUS/Downloads/(1404) Discord ｜ Profiles ｜ User Settings (5_14_2025 9：01：27 PM).html');
const outputPath = normalizePath(process.argv[3] || './extracted-dialog-final.html');

console.log(`Reading file: ${inputPath}`);

// Check if file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  console.log('\nUsage:');
  console.log('  node extract-dialog-final.js [input-file] [output-file]');
  console.log('\nExample:');
  console.log('  node extract-dialog-final.js "C:/Downloads/discord.html" "./extracted.html"');
  process.exit(1);
}

// Read the input file with error handling
try {
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      return;
    }

    console.log('File loaded, searching for target elements...');
    const startTime = Date.now();

    // Find all CSS and script content
    const cssRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    
    let cssContent = '';
    let scriptContent = '';
    let cssMatch;
    let scriptMatch;
    let cssCount = 0;
    let scriptCount = 0;
    
    while ((cssMatch = cssRegex.exec(data)) !== null) {
      cssContent += cssMatch[1] + '\n';
      cssCount++;
    }
    
    while ((scriptMatch = scriptRegex.exec(data)) !== null) {
      // Only include important scripts, skip analytics and similar
      if (!scriptMatch[0].includes('google') && !scriptMatch[0].includes('analytics')) {
        scriptContent += scriptMatch[0] + '\n';
        scriptCount++;
      }
    }
    
    console.log(`Extracted ${cssCount} CSS blocks (${cssContent.length} bytes)`);
    console.log(`Extracted ${scriptCount} script blocks (${scriptContent.length} bytes)`);
    
    // Try to find the dialog using role="dialog"
    const dialogRegex = /<div[^>]*role\s*=\s*["']dialog["'][^>]*>([\s\S]*?<\/div>)<\/div>/i;
    const dialogMatch = data.match(dialogRegex);
    
    let dialogContent = '';
    
    if (dialogMatch) {
      dialogContent = dialogMatch[0];
      console.log('Found dialog using role="dialog"');
    } else {
      // Try to find the focusLock div
      const focusLockRegex = /<div[^>]*class\s*=\s*["'][^"']*focusLock[^"']*["'][^>]*>([\s\S]*?<\/div>)<\/div>/i;
      const focusLockMatch = data.match(focusLockRegex);
      
      if (focusLockMatch) {
        dialogContent = focusLockMatch[0];
        console.log('Found dialog using focusLock class');
      } else {
        // Try to find any modal or popup div as a last resort
        const modalRegex = /<div[^>]*class\s*=\s*["'][^"']*(?:modal|popup|dialog)[^"']*["'][^>]*>([\s\S]*?<\/div>)<\/div>/i;
        const modalMatch = data.match(modalRegex);
        
        if (modalMatch) {
          dialogContent = modalMatch[0];
          console.log('Found dialog using modal/popup/dialog class (fallback)');
        } else {
          console.error('Could not find the dialog element!');
          console.log('Try using a different extraction method or specify a custom selector.');
          console.log('Aborting extraction.');
          return;
        }
      }
    }
    
    // Create our custom styling that matches the Discord profile dialog
    const customStyles = `
<style>
  /* Discord theme colors */
  :root {
    --background-primary: #36393f;
    --background-secondary: #2f3136;
    --background-tertiary: #202225;
    --background-accent: #4f545c;
    --text-normal: #dcddde;
    --text-muted: #72767d;
    --header-primary: #fff;
    --interactive-normal: #b9bbbe;
    --interactive-hover: #dcddde;
    --interactive-active: #fff;
    --interactive-muted: #4f545c;
    --background-floating: #18191c;
    
    /* Profile colors */
    --profile-gradient-primary-color: rgba(0, 0, 0, 0.75);
    --profile-gradient-secondary-color: transparent;
    --profile-body-background-color: #36393f;
    --profile-body-background-hover: #32353b;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: var(--background-tertiary);
    color: var(--text-normal);
    font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1;
    overflow: hidden;
  }
  
  .dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.85);
  }
  
  /* Styling for the dialog */
  [role="dialog"] {
    background-color: var(--background-primary) !important;
    border-radius: 8px !important;
    box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2) !important;
    overflow: hidden !important;
  }
  
  /* Profile banner */
  [class*="banner"] {
    background-color: #5865f2;
    background-position: center;
    background-size: cover;
  }
  
  /* Profile avatar */
  [class*="avatar"] {
    background-color: var(--background-primary);
    border: 6px solid var(--background-primary);
    border-radius: 50%;
  }
  
  /* Input area styling */
  [role="textbox"], textarea, input {
    background-color: var(--background-tertiary) !important;
    color: var(--text-normal) !important;
    border: none !important;
    border-radius: 3px !important;
  }
  
  /* Text coloring */
  h1, h2, h3, h4, h5 {
    color: var(--header-primary) !important;
  }
  
  /* Button styling */
  button {
    background-color: var(--background-accent) !important;
    color: white !important;
    border: none !important;
    border-radius: 3px !important;
  }
  
  /* Ensure all SVG icons are properly visible */
  svg {
    color: var(--interactive-normal) !important;
    fill: currentColor !important;
  }
  
  /* Force dark theme */
  .theme-dark {
    --background-primary: #36393f;
    --background-secondary: #2f3136;
    --background-tertiary: #202225;
    --header-primary: white;
    --header-secondary: #b9bbbe;
    --text-normal: #dcddde;
  }
</style>
    `;
    
    // Create the final HTML document
    const finalHtml = `
<!DOCTYPE html>
<html lang="en" class="theme-dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discord Profile Dialog</title>
  ${customStyles}
  <style>
    ${cssContent}
  </style>
</head>
<body class="theme-dark">
  <div class="dialog-container">
    ${dialogContent}
  </div>
  
  ${scriptContent}
  
  <script>
    // Simple script to close the dialog when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        alert('Dialog would normally close here.');
      }
    });
    
    // Log that extraction completed successfully
    console.log('Discord dialog extracted successfully.');
  </script>
</body>
</html>
    `;
    
    // Write the output file
    try {
      fs.writeFileSync(outputPath, finalHtml);
      
      // Report file size reduction
      const originalSize = Buffer.byteLength(data, 'utf8');
      const newSize = Buffer.byteLength(finalHtml, 'utf8');
      const reduction = ((originalSize - newSize) / originalSize) * 100;
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      console.log(`\nExtraction completed in ${processingTime.toFixed(2)} seconds`);
      console.log(`Output saved to: ${outputPath}`);
      console.log(`\nFile size reduction: ${reduction.toFixed(2)}%`);
      console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`New: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`\nOpen the file in your browser to view the extracted dialog.`);
    } catch (writeErr) {
      console.error('Error writing output file:', writeErr.message);
      console.log('Check that you have permission to write to the output location.');
    }
  });
} catch (e) {
  console.error('Critical error:', e.message);
} 