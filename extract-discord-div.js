const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// File paths
const inputPath = path.resolve(process.argv[2] || 'C:/Users/ASUS/Downloads/(1404) Discord ｜ Profiles ｜ User Settings (5_14_2025 9：01：27 PM).html');
const outputPath = path.resolve(process.argv[3] || './extracted-discord-dialog.html');

console.log(`Reading file: ${inputPath}`);

// Read the input file
fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  console.log('File loaded, creating DOM...');
  const dom = new JSDOM(data);
  const document = dom.window.document;

  // Find the target div
  const targetDiv = document.querySelector('.focusLock__49fc1');
  
  if (!targetDiv) {
    console.error('Target div with class focusLock__49fc1 not found!');
    return;
  }
  
  console.log('Target div found, extracting classes and IDs...');

  // Extract all classes and IDs recursively
  const classesAndIds = new Set();
  
  function extractClassesAndIds(element) {
    // Add classes
    if (element.classList && element.classList.length > 0) {
      Array.from(element.classList).forEach(cls => classesAndIds.add(`.${cls}`));
    }
    
    // Add IDs
    if (element.id) {
      classesAndIds.add(`#${element.id}`);
    }
    
    // Process children
    Array.from(element.children).forEach(child => extractClassesAndIds(child));
  }
  
  extractClassesAndIds(targetDiv);
  
  console.log(`Found ${classesAndIds.size} unique classes and IDs`);
  
  // Extract only relevant styles
  const styleElements = document.querySelectorAll('style');
  let relevantStyles = '';
  
  styleElements.forEach(styleEl => {
    const cssText = styleEl.textContent;
    const parts = cssText.split(/[{}]/g);
    let keepNextBlock = false;
    let relevantCss = '';
    
    for (let i = 0; i < parts.length - 1; i += 2) {
      const selectors = parts[i].trim().split(',');
      keepNextBlock = false;
      
      for (const selector of selectors) {
        const cleanSelector = selector.trim();
        
        // Check if this selector contains any of our classes or IDs
        for (const classOrId of classesAndIds) {
          if (cleanSelector.includes(classOrId.substring(1)) || 
              cleanSelector === classOrId.substring(1) ||
              cleanSelector.includes(classOrId)) {
            keepNextBlock = true;
            break;
          }
        }
        
        if (keepNextBlock) break;
      }
      
      if (keepNextBlock && i + 1 < parts.length) {
        relevantCss += `${parts[i]} { ${parts[i+1]} }\n`;
      }
    }
    
    relevantStyles += relevantCss;
  });
  
  console.log('Extracted relevant styles');
  
  // Extract scripts (keeping all scripts to be safe)
  const scriptElements = document.querySelectorAll('script');
  let scripts = '';
  
  scriptElements.forEach(scriptEl => {
    if (scriptEl.src) {
      scripts += `<script src="${scriptEl.src}"></script>\n`;
    } else {
      scripts += `<script>${scriptEl.textContent}</script>\n`;
    }
  });
  
  console.log('Extracted scripts');
  
  // Create a new HTML document with only our content
  const newHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Discord Dialog</title>
  <style>
${relevantStyles}
  </style>
</head>
<body>
  ${targetDiv.outerHTML}
  ${scripts}
</body>
</html>
  `;
  
  // Write the output file
  fs.writeFile(outputPath, newHtml, err => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(`Successfully extracted dialog to: ${outputPath}`);
  });
}); 