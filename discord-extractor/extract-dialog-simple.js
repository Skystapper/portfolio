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
const outputPath = normalizePath(process.argv[3] || './extracted-dialog-simple.html');
const targetClassName = process.argv[4] || 'focusLock__49fc1';

console.log(`Reading file: ${inputPath}`);
console.log(`Target class: ${targetClassName}`);

// Read the input file with error handling
try {
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      return;
    }

    console.log('File loaded, searching for target element...');
    
    // Extract the head content (preserving all CSS and JS)
    const headRegex = /<head[\s\S]*?<\/head>/i;
    const headMatch = data.match(headRegex);
    const headContent = headMatch ? headMatch[0] : '<head></head>';
    
    // Find the div with the target class
    // This is a more robust regex that looks for the class in the class attribute
    const targetRegex = new RegExp(`<div[^>]*class\\s*=\\s*["'][^"']*${targetClassName}[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, 'i');
    const match = data.match(targetRegex);
    
    if (!match) {
      console.error('Target element not found!');
      
      // Try a simpler regex to look for class name anywhere in the HTML
      const classNameRegex = new RegExp(`${targetClassName}`, 'i');
      const classNameMatch = data.match(classNameRegex);
      
      if (classNameMatch) {
        console.log(`The class name '${targetClassName}' was found in the file, but couldn't extract the complete element.`);
        console.log('Try checking the exact class name or use a different approach.');
      } else {
        console.log(`The class name '${targetClassName}' was not found in the file at all.`);
      }
      
      return;
    }
    
    const targetElement = match[0];
    console.log('Target element found!');
    
    // Create a custom style for ensuring proper display
    const customStyle = `
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #36393f;
    color: #dcddde;
    font-family: Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif;
    line-height: 1;
    overflow: hidden;
  }
  
  .modal-container {
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
  
  .${targetClassName} {
    /* Force some essential styles */
    background-color: #36393f;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);
    overflow: hidden;
    max-width: 440px;
  }
  
  /* Ensure input field looks correct */
  .modal-container input,
  .modal-container [role="textbox"] {
    background-color: #202225;
    color: #dcddde;
    border: none;
    border-radius: 3px;
    padding: 10px;
    box-sizing: border-box;
  }
  
  /* Theme variables to ensure proper coloring */
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
  }
  
  /* Force dark theme */
  html, body {
    background-color: #36393f;
  }
  
  /* Add specific Discord styling */
  [role="dialog"] {
    background-color: #36393f;
    border-radius: 8px;
    overflow: hidden;
  }
</style>
    `;
    
    // Build our new HTML document
    const newHtml = `
<!DOCTYPE html>
<html lang="en" class="theme-dark">
${headContent.replace('</head>', customStyle + '</head>')}
<body class="theme-dark">
  <div class="modal-container">
    ${targetElement}
  </div>
</body>
</html>
    `;
    
    // Write the output file
    try {
      fs.writeFileSync(outputPath, newHtml);
      console.log(`Successfully extracted dialog to: ${outputPath}`);
      
      // Report file size reduction
      const originalSize = Buffer.byteLength(data, 'utf8');
      const newSize = Buffer.byteLength(newHtml, 'utf8');
      const reduction = ((originalSize - newSize) / originalSize) * 100;
      
      console.log(`\nFile size reduction: ${reduction.toFixed(2)}%`);
      console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`New: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (writeErr) {
      console.error('Error writing output file:', writeErr.message);
    }
  });
} catch (e) {
  console.error('Critical error:', e.message);
} 