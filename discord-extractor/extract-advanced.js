const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Command line arguments
const args = process.argv.slice(2);
let inputPath, outputPath, targetSelector;

// Parse command line arguments
const argMap = {};
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg.startsWith('--')) {
    const key = arg.substring(2);
    const value = args[i + 1];
    if (value && !value.startsWith('--')) {
      argMap[key] = value;
      i++;
    } else {
      argMap[key] = true;
    }
  }
}

// Handle file paths with special characters
function normalizePath(filePath) {
  try {
    return decodeURIComponent(filePath);
  } catch (e) {
    return filePath;
  }
}

// Set default values or use command line arguments
inputPath = normalizePath(argMap.input || 
  'C:/Users/ASUS/Downloads/(1404) Discord ｜ Profiles ｜ User Settings (5_14_2025 9：01：27 PM).html');
outputPath = normalizePath(argMap.output || './extracted-discord-dialog.html');
targetSelector = argMap.selector || '.focusLock__49fc1';

// Display help if requested
if (argMap.help) {
  console.log(`
Discord Dialog Extractor - Advanced Version
==========================================

Usage:
  node extract-advanced.js --input "path/to/input.html" --output "path/to/output.html" --selector ".class-name"

Options:
  --input    Path to the input HTML file
  --output   Path to the output HTML file
  --selector CSS selector for the target element to extract
  --help     Display this help message

Examples:
  node extract-advanced.js --input "discord.html" --output "extracted.html"
  node extract-advanced.js --selector ".modal__123"
  node extract-advanced.js --help
  `);
  process.exit(0);
}

console.log(`Reading file: ${inputPath}`);
console.log(`Target selector: ${targetSelector}`);

// Read the input file with error handling
try {
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      
      // Special handling for ENOENT (file not found) error
      if (err.code === 'ENOENT') {
        console.error('File not found. Please check the path and try again.');
        console.error('Try running with --help for usage information.');
        
        // Try listing files in the directory to help user
        const dir = path.dirname(inputPath);
        try {
          console.log(`\nFiles in ${dir}:`);
          const files = fs.readdirSync(dir);
          files.forEach(file => {
            if (file.includes('Discord')) {
              console.log(`- ${file}`);
            }
          });
        } catch (listErr) {
          console.error(`Could not list directory contents: ${listErr.message}`);
        }
      }
      return;
    }

    console.log('File loaded, creating DOM...');
    let dom;
    
    try {
      dom = new JSDOM(data);
    } catch (domErr) {
      console.error('Error parsing HTML:', domErr.message);
      return;
    }
    
    const document = dom.window.document;

    // Find the target element
    const targetElement = document.querySelector(targetSelector);
    
    if (!targetElement) {
      console.error(`Target element with selector '${targetSelector}' not found!`);
      
      // Try to suggest other potential selectors
      console.log('\nTrying to find potential dialog elements...');
      const potentialDialogs = document.querySelectorAll('[role="dialog"]');
      if (potentialDialogs.length > 0) {
        console.log(`Found ${potentialDialogs.length} elements with role="dialog". Classes:`);
        potentialDialogs.forEach(dialog => {
          if (dialog.classList.length > 0) {
            console.log(`- ${Array.from(dialog.classList).join(' ')}`);
          }
        });
        console.log('\nTry using one of these classes with the --selector option');
      }
      return;
    }
    
    console.log('Target element found, extracting classes and IDs...');

    // Extract all classes and IDs recursively
    const classesAndIds = new Set();
    const animationNames = new Set();
    
    function extractClassesAndIds(element) {
      // Add classes
      if (element.classList && element.classList.length > 0) {
        Array.from(element.classList).forEach(cls => classesAndIds.add(`.${cls}`));
      }
      
      // Add IDs
      if (element.id) {
        classesAndIds.add(`#${element.id}`);
      }
      
      // Check for animation/transition properties in inline styles
      if (element.style) {
        const style = element.style;
        if (style.animation) {
          // Extract animation name from the animation property
          const animName = style.animation.split(' ')[0];
          if (animName) animationNames.add(animName);
        }
        if (style.animationName) {
          animationNames.add(style.animationName);
        }
      }
      
      // Process children
      Array.from(element.children).forEach(child => extractClassesAndIds(child));
    }
    
    extractClassesAndIds(targetElement);
    
    console.log(`Found ${classesAndIds.size} unique classes and IDs`);
    if (animationNames.size > 0) {
      console.log(`Found ${animationNames.size} animation names`);
    }
    
    // Extract all style elements
    const styleElements = document.querySelectorAll('style');
    let allCssText = '';
    
    // First, collect all CSS as text
    styleElements.forEach(styleEl => {
      allCssText += styleEl.textContent + '\n';
    });
    
    // Find all keyframes, font-face declarations, and root variables
    const keyframesRegex = /@keyframes\s+([a-zA-Z0-9_-]+)\s*\{[\s\S]*?\}/g;
    const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g;
    
    // Extract @keyframes
    const keyframes = new Set();
    let keyframeMatch;
    while ((keyframeMatch = keyframesRegex.exec(allCssText)) !== null) {
      const animationName = keyframeMatch[1];
      keyframes.add(keyframeMatch[0]);
      // Add to animation names to track
      animationNames.add(animationName);
    }
    
    // Extract @font-face
    const fontFaces = new Set();
    let fontFaceMatch;
    while ((fontFaceMatch = fontFaceRegex.exec(allCssText)) !== null) {
      fontFaces.add(fontFaceMatch[0]);
    }
    
    // New approach to extract styles
    let relevantStyles = '';
    
    // Add all font-face declarations
    console.log(`Found ${fontFaces.size} font-face declarations`);
    fontFaces.forEach(fontFace => {
      relevantStyles += fontFace + '\n';
    });
    
    // Process each style element
    styleElements.forEach(styleEl => {
      const cssText = styleEl.textContent;
      
      // Handle non-media query rules
      const parts = cssText.split(/[{}]/g);
      let keepNextBlock = false;
      let relevantCss = '';
      
      for (let i = 0; i < parts.length - 1; i += 2) {
        // Skip if it's an @media, @keyframes, or @font-face rule - we handle these separately
        if (parts[i].trim().startsWith('@media') || 
            parts[i].trim().startsWith('@keyframes') ||
            parts[i].trim().startsWith('@font-face')) {
          continue;
        }
        
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
          
          // Check for animation properties in this CSS block
          const cssBlock = parts[i+1];
          const animationProps = cssBlock.match(/animation(-name)?:\s*([^;]+)/g);
          if (animationProps) {
            animationProps.forEach(prop => {
              // Extract animation names
              const animNames = prop.replace(/animation(-name)?:\s*/, '').split(/\s+|,/);
              animNames.forEach(name => {
                name = name.trim();
                if (name && !name.startsWith('#') && !name.match(/^\d/) && name !== 'none') {
                  animationNames.add(name);
                }
              });
            });
          }
        }
      }
      
      // Add the non-media query CSS blocks
      relevantStyles += relevantCss;
      
      // Handle media queries separately
      let mediaMatch;
      const mediaQueryRegex = /@media[^{]+\{([\s\S]+?)(?=}\s*(@|$))/g;
      while ((mediaMatch = mediaQueryRegex.exec(cssText)) !== null) {
        const mediaQueryContent = mediaMatch[1];
        const mediaQueryHeader = mediaMatch[0].substring(0, mediaMatch[0].indexOf('{')+1);
        
        // Check if any of our classes or IDs are in this media query
        let mediaQueryRelevant = false;
        for (const classOrId of classesAndIds) {
          if (mediaQueryContent.includes(classOrId.substring(1)) || 
              mediaQueryContent.includes(classOrId)) {
            mediaQueryRelevant = true;
            break;
          }
        }
        
        if (mediaQueryRelevant) {
          // Now we need to filter just the relevant selectors within the media query
          const mediaRules = mediaQueryContent.split(/[{}]/g);
          let relevantMediaCss = mediaQueryHeader + '\n';
          
          for (let i = 0; i < mediaRules.length - 1; i += 2) {
            const selectors = mediaRules[i].trim().split(',');
            let keepMediaBlock = false;
            
            for (const selector of selectors) {
              const cleanSelector = selector.trim();
              
              // Check if this selector contains any of our classes or IDs
              for (const classOrId of classesAndIds) {
                if (cleanSelector.includes(classOrId.substring(1)) || 
                    cleanSelector === classOrId.substring(1) ||
                    cleanSelector.includes(classOrId)) {
                  keepMediaBlock = true;
                  break;
                }
              }
              
              if (keepMediaBlock) break;
            }
            
            if (keepMediaBlock && i + 1 < mediaRules.length) {
              relevantMediaCss += `  ${mediaRules[i]} { ${mediaRules[i+1]} }\n`;
            }
          }
          
          relevantMediaCss += '}\n';
          relevantStyles += relevantMediaCss;
        }
      }
    });
    
    // Add all keyframes referenced by our animations
    console.log(`Looking for keyframes...`);
    keyframes.forEach(keyframe => {
      const keyframeName = keyframe.match(/@keyframes\s+([a-zA-Z0-9_-]+)/)[1];
      if (animationNames.has(keyframeName)) {
        console.log(`Adding keyframe: ${keyframeName}`);
        relevantStyles = keyframe + '\n' + relevantStyles;
      }
    });
    
    // Add root variables that might be referenced
    const rootStyles = allCssText.match(/:root\s*{[^}]*}/g);
    if (rootStyles) {
      relevantStyles = rootStyles.join('\n') + '\n' + relevantStyles;
    }
    
    console.log('Extracted relevant styles including animations, media queries, and fonts');
    
    // Extract scripts (keeping all scripts to be safe)
    const scriptElements = document.querySelectorAll('script');
    let scripts = '';
    
    scriptElements.forEach(scriptEl => {
      if (scriptEl.src) {
        scripts += `<script src="${scriptEl.src}"></script>\n`;
      } else if (scriptEl.textContent.trim()) {
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discord Element Extraction</title>
  <style>
${relevantStyles}
  </style>
</head>
<body>
  ${targetElement.outerHTML}
  ${scripts}
</body>
</html>
    `;
    
    // Write the output file
    try {
      fs.writeFileSync(outputPath, newHtml);
      console.log(`Successfully extracted element to: ${outputPath}`);
      
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