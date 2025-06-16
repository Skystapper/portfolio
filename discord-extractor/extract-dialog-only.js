const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Handle file paths with special characters
function normalizePath(filePath) {
  try {
    return decodeURIComponent(filePath);
  } catch (e) {
    return filePath;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
let inputPath, outputPath, targetSelector;
const options = {
  saveImagesLocally: false,
  disableCsp: false
};

// Check for flag-style arguments
if (args.length < 2) {
  console.log('Usage: node extract-dialog-only.js <input-file> <output-file> <target-selector> [options]');
  console.log('Options:');
  console.log('  --save-images    Save images locally instead of using Discord CDN URLs');
  console.log('  --disable-csp    Disable Content Security Policy restrictions completely');
  console.log('\nExample:');
  console.log('  node extract-dialog-only.js "discord-page.html" "dialog-only.html" ".messagesWrapper-RpOMA3" --disable-csp');
  process.exit(1);
}

// Extract positional arguments
inputPath = normalizePath(args[0]);
outputPath = normalizePath(args[1]);
targetSelector = args[2] || '.focusLock__49fc1';

// Process flags
options.saveImagesLocally = args.includes('--save-images');
options.disableCsp = args.includes('--disable-csp');

// Output usage information
console.log(`Reading file: ${inputPath}`);
console.log(`Target selector: ${targetSelector}`);
console.log(`Save images locally: ${options.saveImagesLocally ? 'Yes' : 'No'}`);
console.log(`Disable CSP: ${options.disableCsp ? 'Yes' : 'No'}`);

// Check if file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  console.log('\nUsage:');
  console.log('  node extract-dialog-only.js <input-file> <output-file> <target-selector> [options]');
  console.log('Options:');
  console.log('  --save-images    Save images locally instead of using Discord CDN URLs');
  console.log('  --disable-csp    Disable Content Security Policy restrictions completely');
  process.exit(1);
}

// Read the input file with error handling
try {
  fs.readFile(inputPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err.message);
      
      // Special handling for ENOENT (file not found) error
      if (err.code === 'ENOENT') {
        console.error('File not found. Please check the path and try again.');
        
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
    const startTime = Date.now();
    let dom;
    
    try {
      // Configure JSDOM to ignore CSS parsing errors
      const options = {
        runScripts: "outside-only",
        pretendToBeVisual: true,
        virtualConsole: new (require('jsdom').VirtualConsole)().sendTo(console, { omitJSDOMErrors: true })
      };
      
      dom = new JSDOM(data, options);
    } catch (domErr) {
      console.error('Error parsing HTML:', domErr.message);
      return;
    }
    
    const document = dom.window.document;

    // Find the target element
    const targetElement = document.querySelector(targetSelector);
    
    if (!targetElement) {
      console.error(`Target element with selector '${targetSelector}' not found!`);
      // Try to suggest other potential classes
      console.log('\nTrying to find potential dialog elements...');
      const potentialDialogs = document.querySelectorAll('[role="dialog"]');
      if (potentialDialogs.length > 0) {
        console.log(`Found ${potentialDialogs.length} elements with role="dialog". Classes:`);
        potentialDialogs.forEach(dialog => {
          if (dialog.classList.length > 0) {
            console.log(`- ${Array.from(dialog.classList).join(' ')}`);
          }
        });
      }
      return;
    }
    
    console.log('Target element found. Extracting parent hierarchy...');

    // Build array of ancestors
    const ancestors = [];
    let currentElement = targetElement.parentElement;
    
    while (currentElement && currentElement !== document.body) {
      ancestors.unshift(currentElement); // Add to beginning of array
      currentElement = currentElement.parentElement;
    }
    
    // Also include body and html for complete styling context
    if (document.body && document.body.parentElement) {
      ancestors.unshift(document.body);
      ancestors.unshift(document.body.parentElement); // html element
    }
    
    console.log(`Found ${ancestors.length} parent elements including body and html.`);
    
    // Create a new document preserving the entire HTML structure but removing unnecessary elements
    console.log('Creating new DOM and filtering unwanted elements...');
    const newDom = new JSDOM(data, {
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole: new (require('jsdom').VirtualConsole)().sendTo(console, { omitJSDOMErrors: true })
    });
    const newDocument = newDom.window.document;
    
    // Find the target in the new document
    const newTargetElement = newDocument.querySelector(targetSelector);
    
    if (!newTargetElement) {
      console.error('Could not find target element in the new document!');
      return;
    }
    
    console.log('Removing unrelated elements from DOM...');
    
    // Function to remove all siblings of an element
    function removeAllSiblings(element) {
      const parent = element.parentNode;
      if (!parent) return;
      
      // Get all children of the parent
      const children = Array.from(parent.children);
      
      // Remove all children except the element
      children.forEach(child => {
        if (child !== element) {
          parent.removeChild(child);
        }
      });
    }
    
    // Remove unnecessary elements while preserving the path to our target
    let current = newTargetElement;
    while (current && current !== newDocument.body) {
      removeAllSiblings(current);
      current = current.parentNode;
    }
    
    // Check if a backdrop already exists in the content
    const existingBackdrop = newDocument.querySelector('.discord-backdrop');
    
    // Find the body element or create one if not exists
    const bodyElement = newDocument.body;
    
    // Make sure no other content exists in the body except our target's ancestors
    Array.from(bodyElement.children).forEach(child => {
      // Check if this child is an ancestor of our target
      let isAncestor = false;
      let testEl = newTargetElement;
      while (testEl && testEl !== bodyElement) {
        if (testEl === child) {
          isAncestor = true;
          break;
        }
        testEl = testEl.parentNode;
      }
      
      // If not an ancestor, remove it
      if (!isAncestor) {
        bodyElement.removeChild(child);
      }
    });
    
    // Only add a backdrop if one doesn't already exist
    let backdropDiv;
    if (!existingBackdrop) {
      // Add a backdrop container to help with positioning and background
      console.log('Adding backdrop container...');
      backdropDiv = newDocument.createElement('div');
      backdropDiv.className = 'discord-backdrop';
      backdropDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.85);
      `;
      
      // Add our backdrop as the first child of body
      bodyElement.insertBefore(backdropDiv, bodyElement.firstChild);
    } else {
      console.log('Using existing backdrop container...');
      backdropDiv = existingBackdrop;
    }
    
    // Move our target's top-level ancestor into the backdrop
    const topLevelAncestor = bodyElement.querySelector(`*:not(.discord-backdrop)`);
    if (topLevelAncestor && !existingBackdrop) {
      backdropDiv.appendChild(topLevelAncestor);
    }
    
    // Ensure all SVG elements, masks, clip-paths, and definitions are preserved
    // Find all SVG-related elements in the original document
    console.log('Preserving SVG elements and definitions...');
    const svgElements = document.querySelectorAll('svg, mask, clipPath, defs, filter, linearGradient, radialGradient, pattern');
    
    // Create a container for SVG definitions if they don't already exist
    let defsContainer = newDocument.querySelector('defs');
    if (!defsContainer) {
      defsContainer = newDocument.createElement('defs');
      defsContainer.id = 'svg-definitions';
      
      // Add to the head to ensure it's loaded before other content
      if (newDocument.head) {
        newDocument.head.appendChild(defsContainer);
      }
    }
    
    // Clone and add all SVG-related elements to our document
    svgElements.forEach(element => {
      // Skip elements that are already included in our target hierarchy
      const id = element.id;
      if (id && newDocument.getElementById(id)) {
        return;
      }
      
      // Clone the element
      const clone = element.cloneNode(true);
      
      // Add to our definitions container or appropriate place
      if (element.tagName.toLowerCase() === 'svg' && id) {
        // Only check for existing SVG if we have a valid ID
        if (!newDocument.querySelector(`svg[id="${id}"]`)) {
          // For standalone SVGs, add to body but hide them
          clone.style.display = 'none';
          clone.style.position = 'absolute';
          bodyElement.appendChild(clone);
        }
      } else if (['mask', 'clippath', 'defs', 'filter', 'lineargradient', 'radialgradient', 'pattern'].includes(element.tagName.toLowerCase())) {
        // For definitions, add to our defs container
        defsContainer.appendChild(clone);
      }
    });
    
    // Replace base64 image data with descriptive comments
    console.log('Replacing base64 images with Discord CDN URLs or descriptive comments...');
    
    // Map of Discord CDN URLs by type to use as replacements
    const cdnUrlMap = {
      profileAvatar: "https://cdn.discordapp.com/avatars/908657241505280021/f0297feb64102ee3f4580753522c9bb5.webp?size=80",
      avatarDecoration: "https://cdn.discordapp.com/avatar-decoration-presets/a_28fbe43ba1ee217576dee69712bbb628.png?size=96&passthrough=true",
      badge: "https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png",
      profileEffect1: "https://cdn.discordapp.com/assets/profile_effects/effects/2024-11-22/lofi-girl-study-break/intro.png",
      profileEffect2: "https://cdn.discordapp.com/assets/profile_effects/effects/2024-11-22/lofi-girl-study-break/idle_light.png"
    };
    
    // Function to download images locally if requested
    let localImageMap = {};
    if (options.saveImagesLocally) {
      console.log('Downloading CDN images locally...');
      const https = require('https');
      const path = require('path');
      const imagesDir = path.join(path.dirname(outputPath), 'images');
      
      // Create images directory if it doesn't exist
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      
      // Download function for a single image
      const downloadImage = (url, filename) => {
        return new Promise((resolve, reject) => {
          const localPath = path.join(imagesDir, filename);
          
          // Skip if the file already exists
          if (fs.existsSync(localPath)) {
            console.log(`- Image already exists: ${filename}`);
            resolve(`./images/${filename}`);
            return;
          }
          
          console.log(`- Downloading image: ${filename} from ${url}`);
          
          // Parse URL
          const urlObj = new URL(url);
          
          // Setup HTTP request
          const options = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: 'GET'
          };
          
          const request = https.request(options, response => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
              console.log(`  - Following redirect to: ${response.headers.location}`);
              downloadImage(response.headers.location, filename)
                .then(resolve)
                .catch(reject);
              return;
            }
            
            // Check for successful response
            if (response.statusCode !== 200) {
              reject(new Error(`Failed to download image: ${response.statusCode}`));
              return;
            }
            
            // Write the file
            const file = fs.createWriteStream(localPath);
            response.pipe(file);
            
            file.on('finish', () => {
              file.close();
              console.log(`  - Downloaded successfully: ${filename}`);
              resolve(`./images/${filename}`);
            });
          });
          
          request.on('error', (err) => {
            console.error(`  - Error downloading ${filename}: ${err.message}`);
            reject(err);
          });
          
          request.end();
        });
      };
      
      // Download all the images
      const downloadPromises = [];
      for (const [type, url] of Object.entries(cdnUrlMap)) {
        try {
          const filename = `discord-${type}.${url.split('.').pop().split('?')[0]}`;
          const promise = downloadImage(url, filename)
            .then(localPath => {
              localImageMap[type] = localPath;
              return localPath;
            })
            .catch(err => {
              console.error(`Failed to download ${type}: ${err.message}`);
              // Use CDN URL as fallback
              localImageMap[type] = url;
              return url;
            });
          
          downloadPromises.push(promise);
        } catch (err) {
          console.error(`Error setting up download for ${type}: ${err.message}`);
          localImageMap[type] = url; // Use CDN URL as fallback
        }
      }
      
      // Wait for all downloads to complete
      Promise.all(downloadPromises)
        .then(() => {
          console.log('All images downloaded successfully');
        })
        .catch(err => {
          console.error('Error downloading some images:', err.message);
        });
      
      // Use local images instead of CDN URLs
      for (const [type, localPath] of Object.entries(localImageMap)) {
        cdnUrlMap[type] = localPath;
      }
    }
    
    // Track base64 data for reporting
    let base64Stats = {
      count: 0,
      totalSize: 0,
      replaced: 0,
      byType: {
        profileAvatar: 0,
        profileBanner: 0,
        icon: 0,
        emoji: 0,
        decoration: 0,
        badge: 0,
        other: 0
      }
    };
    
    // Helper function to calculate base64 size
    function calculateBase64Size(base64String) {
      // Extract just the data part if it's a data URI
      let base64Data = base64String;
      if (base64String.includes(',')) {
        base64Data = base64String.split(',')[1];
      }
      
      // Size formula: number of characters * 0.75 (base64 encoding overhead)
      return Math.round(base64Data.length * 0.75);
    }
    
    // Function to extract image type from element attributes and structure
    function detectImageType(element) {
      // Helper to check element classes
      const hasClass = (el, className) => {
        if (!el || !el.classList) return false;
        return el.classList.contains && typeof el.classList.contains === 'function' 
               ? el.classList.contains(className) : false;
      };
      
      // Helper to check if any parent has a certain class
      const hasParentWithClass = (el, className, maxDepth = 3) => {
        let current = el;
        let depth = 0;
        while (current && depth < maxDepth) {
          if (hasClass(current, className)) return true;
          current = current.parentElement;
          depth++;
        }
        return false;
      };
      
      // Check attributes
      const ariaLabel = element.getAttribute('aria-label') || '';
      const alt = element.getAttribute('alt') || '';
      const role = element.getAttribute('role') || '';
      
      // Check element dimensions
      const width = parseInt(element.getAttribute('width') || '0');
      const height = parseInt(element.getAttribute('height') || '0');
      
      // Detect profile avatar
      if (hasClass(element, 'avatar__44b0c') || hasParentWithClass(element, 'avatar_d28e10') || 
          ariaLabel.includes('profile') || (width === 80 && height === 80)) {
        return 'profileAvatar';
      }
      
      // Detect avatar decoration
      if (hasClass(element, 'avatarDecoration__44b0c') || ariaLabel.includes('decoration')) {
        return 'avatarDecoration';
      }
      
      // Detect badge
      if (hasClass(element, 'badge__8061a') || alt.includes('badge') || width === 24 && height === 24) {
        return 'badge';
      }
      
      // Detect profile effects
      if (hasClass(element, 'effect__01370') || alt.includes('Lofi Girl')) {
        // Choose which effect based on context
        if (alt.includes('idle')) {
          return 'profileEffect2';
        }
        return 'profileEffect1';
      }
      
      return null;
    }
    
    // Helper function to determine image context and get appropriate CDN URL
    function getImageContext(imgElement) {
      // Get class names safely as strings
      const parentElement = imgElement.parentElement;
      const parentClasses = parentElement && typeof parentElement.className === 'string' ? parentElement.className : '';
      
      const grandparentElement = parentElement && parentElement.parentElement;
      const grandparentClasses = grandparentElement && typeof grandparentElement.className === 'string' ? 
                                grandparentElement.className : '';
      
      // Helper function to check if a string contains a substring
      const hasClass = (str, className) => typeof str === 'string' && str.includes(className);
      
      // Try to detect image type from element characteristics
      const detectedType = detectImageType(imgElement);
      if (detectedType && cdnUrlMap[detectedType]) {
        // Use local path if available, otherwise CDN URL
        const imgUrl = options.saveImagesLocally && localImageMap[detectedType] ? 
                      localImageMap[detectedType] : 
                      cdnUrlMap[detectedType];
        
        if (detectedType === 'profileAvatar') {
          return { type: "Profile Avatar", cdnUrl: imgUrl };
        } else if (detectedType === 'avatarDecoration') {
          return { type: "Avatar Decoration", cdnUrl: imgUrl };
        } else if (detectedType === 'badge') {
          return { type: "Badge", cdnUrl: imgUrl };
        } else if (detectedType === 'profileEffect1') {
          return { type: "Profile Effect", cdnUrl: imgUrl };
        } else if (detectedType === 'profileEffect2') {
          return { type: "Profile Effect (Idle)", cdnUrl: imgUrl };
        }
      }
      
      // Check for common Discord image contexts based on class names
      if (hasClass(parentClasses, 'avatar') || hasClass(grandparentClasses, 'avatar')) {
        if (hasClass(parentClasses, 'avatarDecoration') || hasClass(grandparentClasses, 'avatarDecoration')) {
          return { type: "Avatar Decoration", cdnUrl: cdnUrlMap.avatarDecoration };
        }
        return { type: "Profile Avatar", cdnUrl: cdnUrlMap.profileAvatar };
      } else if (hasClass(parentClasses, 'banner') || hasClass(grandparentClasses, 'banner')) {
        return { type: "Profile Banner", cdnUrl: null };
      } else if (hasClass(parentClasses, 'badge') || hasClass(grandparentClasses, 'badge')) {
        return { type: "Badge", cdnUrl: cdnUrlMap.badge };
      } else if (hasClass(parentClasses, 'effect') || hasClass(grandparentClasses, 'effect')) {
        return { type: "Profile Effect", cdnUrl: cdnUrlMap.profileEffect1 };
      } else if (hasClass(parentClasses, 'icon') || hasClass(grandparentClasses, 'icon')) {
        return { type: "Icon", cdnUrl: null };
      } else if (hasClass(parentClasses, 'emoji') || hasClass(grandparentClasses, 'emoji')) {
        return { type: "Emoji", cdnUrl: null };
      } else if (hasClass(parentClasses, 'decoration') || hasClass(grandparentClasses, 'decoration')) {
        return { type: "Avatar Decoration", cdnUrl: cdnUrlMap.avatarDecoration };
      } else if (imgElement.alt) {
        if (imgElement.alt.includes("Lofi Girl")) {
          return { type: `Image: ${imgElement.alt}`, cdnUrl: cdnUrlMap.profileEffect2 };
        }
        return { type: `Image: ${imgElement.alt}`, cdnUrl: null };
      } else {
        return { type: "Image", cdnUrl: null };
      }
    }
    
    // Replace base64 images in img tags
    const images = newDocument.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && (src.startsWith('data:image/') || src.includes('base64'))) {
        const imageInfo = getImageContext(img);
        const context = imageInfo.type;
        const cdnUrl = imageInfo.cdnUrl;
        
        // Track statistics
        base64Stats.count++;
        const size = calculateBase64Size(src);
        base64Stats.totalSize += size;
        
        // Add to the appropriate category
        if (context.includes("Profile Avatar")) {
          base64Stats.byType.profileAvatar += size;
        } else if (context.includes("Profile Banner")) {
          base64Stats.byType.profileBanner += size;
        } else if (context.includes("Icon")) {
          base64Stats.byType.icon += size;
        } else if (context.includes("Emoji")) {
          base64Stats.byType.emoji += size;
        } else if (context.includes("Decoration")) {
          base64Stats.byType.decoration += size;
        } else if (context.includes("Badge")) {
          base64Stats.byType.badge += size;
        } else {
          base64Stats.byType.other += size;
        }
        
        // If we have a CDN URL, use that instead of placeholder
        if (cdnUrl) {
          img.setAttribute('src', cdnUrl);
          img.setAttribute('data-original-type', 'replaced-base64-image');
          base64Stats.replaced++;
          
          // Create a comment node and insert it before the image
          const comment = newDocument.createComment(` ${context} (base64 image replaced with CDN URL) `);
          img.parentNode.insertBefore(comment, img);
        } else {
          img.setAttribute('src', '#');
          img.setAttribute('data-original-type', 'base64-image');
          img.setAttribute('alt', `[${context}]`);
          
          // Create a comment node and insert it before the image
          const comment = newDocument.createComment(` ${context} (base64 image removed) `);
          img.parentNode.insertBefore(comment, img);
        }
      }
    });
    
    // Replace base64 backgrounds in inline styles
    const elementsWithStyle = newDocument.querySelectorAll('[style*="background-image"], [style*="background"]');
    elementsWithStyle.forEach(el => {
      const style = el.getAttribute('style');
      if (style && (style.includes('data:image/') || style.includes('base64'))) {
        // Track statistics
        base64Stats.count++;
        
        // Extract the base64 data for size calculation
        const base64Match = style.match(/data:image\/[^;]+;base64,([^'")]+)/);
        if (base64Match && base64Match[1]) {
          const size = calculateBase64Size(base64Match[0]);
          base64Stats.totalSize += size;
          
          // Determine context and appropriate replacement
          let context = "Background Image";
          let cdnUrl = null;
          
          // Helper function to safely check for class
          const hasClass = (className) => {
            if (!el.classList) return false;
            return el.classList.contains && typeof el.classList.contains === 'function' 
                   ? el.classList.contains(className) : false;
          };
          
          // Try to detect image type based on element characteristics
          const detectedType = detectImageType(el);
          if (detectedType && cdnUrlMap[detectedType]) {
            // Use local path if available
            cdnUrl = options.saveImagesLocally && localImageMap[detectedType] ? 
                    localImageMap[detectedType] : 
                    cdnUrlMap[detectedType];
            
            // Set context based on the detected type
            if (detectedType === 'profileAvatar') {
              context = "Avatar Background";
              base64Stats.byType.profileAvatar += size;
            } else if (detectedType === 'avatarDecoration') {
              context = "Avatar Decoration Background";
              base64Stats.byType.decoration += size;
            } else if (detectedType === 'profileEffect1' || detectedType === 'profileEffect2') {
              context = "Profile Effect Background";
              base64Stats.byType.other += size;
            } else {
              base64Stats.byType.other += size;
            }
          } else if (hasClass('banner')) {
            context = "Profile Banner Background";
            base64Stats.byType.profileBanner += size;
          } else if (hasClass('avatar')) {
            context = "Avatar Background";
            // Use local path if available
            cdnUrl = options.saveImagesLocally && localImageMap.profileAvatar ? 
                    localImageMap.profileAvatar : 
                    cdnUrlMap.profileAvatar;
            base64Stats.byType.profileAvatar += size;
          } else {
            base64Stats.byType.other += size;
          }
          
          // Extract just the background-related properties
          const backgroundProps = style.split(';')
            .filter(prop => !prop.includes('base64') && !prop.includes('data:image/'))
            .join(';');
          
          // Set new background
          let newStyle;
          if (cdnUrl) {
            newStyle = backgroundProps + `;background-image: url('${cdnUrl}');background-size: cover;background-position: center;`;
            base64Stats.replaced++;
          } else {
            newStyle = backgroundProps + ';background-color:rgba(0,0,0,0.2);';
          }
          
          el.setAttribute('style', newStyle);
          el.setAttribute('data-had-base64-bg', 'true');
          
          // Add a comment as the first child
          const commentText = cdnUrl ? 
            `${context} (base64 image replaced with CDN URL)` : 
            `${context} (base64 image removed)`;
          const comment = newDocument.createComment(` ${commentText} `);
          
          if (el.firstChild) {
            el.insertBefore(comment, el.firstChild);
          } else {
            el.appendChild(comment);
          }
        }
      }
    });
    
    // Replace SVG image references
    const svgImages = newDocument.querySelectorAll('image');
    svgImages.forEach(svgImage => {
      const href = svgImage.getAttribute('href') || svgImage.getAttribute('xlink:href');
      if (href && (href.startsWith('data:image/') || href.includes('base64'))) {
        // Track statistics
        base64Stats.count++;
        const size = calculateBase64Size(href);
        base64Stats.totalSize += size;
        base64Stats.byType.other += size;
        
        // Check if there's a parent element with a class that might indicate the image type
        const parentElement = svgImage.parentElement;
        let cdnUrl = null;
        
        if (parentElement) {
          const parentClasses = parentElement.getAttribute('class') || '';
          const hasClass = (str, className) => typeof str === 'string' && str.includes(className);
          
          // Try to detect image type based on structure and attributes
          const detectedType = detectImageType(svgImage);
          if (detectedType && cdnUrlMap[detectedType]) {
            // Use local path if available
            cdnUrl = options.saveImagesLocally && localImageMap[detectedType] ? 
                    localImageMap[detectedType] : 
                    cdnUrlMap[detectedType];
          } else if (hasClass(parentClasses, 'avatar')) {
            // Use local path if available
            cdnUrl = options.saveImagesLocally && localImageMap.profileAvatar ? 
                    localImageMap.profileAvatar : 
                    cdnUrlMap.profileAvatar;
          } else if (hasClass(parentClasses, 'decoration')) {
            // Use local path if available
            cdnUrl = options.saveImagesLocally && localImageMap.avatarDecoration ? 
                    localImageMap.avatarDecoration : 
                    cdnUrlMap.avatarDecoration;
          }
        }
        
        if (cdnUrl) {
          // Use the CDN URL instead
          svgImage.setAttribute('href', cdnUrl);
          if (svgImage.hasAttribute('xlink:href')) {
            svgImage.setAttribute('xlink:href', cdnUrl);
          }
          base64Stats.replaced++;
        } else {
          // Use placeholder
          svgImage.setAttribute('href', '#');
          if (svgImage.hasAttribute('xlink:href')) {
            svgImage.setAttribute('xlink:href', '#');
          }
          
          const width = svgImage.getAttribute('width') || '100%';
          const height = svgImage.getAttribute('height') || '100%';
          
          // Add a rectangle placeholder
          const rect = newDocument.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute('width', width);
          rect.setAttribute('height', height);
          rect.setAttribute('fill', 'rgba(0,0,0,0.2)');
          svgImage.parentNode.insertBefore(rect, svgImage);
          
          // Add descriptive title
          const title = newDocument.createElementNS("http://www.w3.org/2000/svg", "title");
          title.textContent = "SVG Image (base64 data removed)";
          rect.appendChild(title);
        }
      }
    });
    
    // Fix for avatar decoration and profile effects
    console.log('Fixing avatar decoration and profile effects...');
    
    // Handle SVG foreignObject elements
    const foreignObjects = newDocument.querySelectorAll('foreignObject');
    foreignObjects.forEach(fo => {
      // Look for avatar decoration
      if (fo.parentElement && fo.parentElement.classList && 
          fo.parentElement.classList.contains('avatarDecoration__44b0c')) {
        console.log('Found avatar decoration foreignObject');
        
        // Use local path if available
        const decorationSrc = options.saveImagesLocally && localImageMap.avatarDecoration ? 
                             localImageMap.avatarDecoration : 
                             cdnUrlMap.avatarDecoration;
        
        // Find and fix any img elements inside
        const decorationImg = fo.querySelector('img');
        if (decorationImg) {
          console.log('- Found avatar decoration image, setting CDN URL');
          decorationImg.setAttribute('src', decorationSrc);
          decorationImg.setAttribute('data-original-type', 'replaced-base64-image');
        } else {
          // If no image exists, create one
          console.log('- No avatar decoration image found, creating one');
          const newImg = newDocument.createElement('img');
          newImg.setAttribute('src', decorationSrc);
          newImg.setAttribute('class', 'avatar__44b0c');
          newImg.setAttribute('alt', 'Avatar Decoration');
          newImg.setAttribute('aria-hidden', 'true');
          newImg.setAttribute('data-original-type', 'replaced-base64-image');
          
          // Check if there's an avatarStack to add to
          const avatarStack = fo.querySelector('.avatarStack__44b0c');
          if (avatarStack) {
            avatarStack.appendChild(newImg);
          } else {
            // Create an avatar stack if none exists
            const newStack = newDocument.createElement('div');
            newStack.className = 'avatarStack__44b0c';
            newStack.appendChild(newImg);
            fo.appendChild(newStack);
          }
        }
      }
    });
    
    // Fix profile effects section
    const profileEffectsDiv = newDocument.querySelector('.profileEffects__01370');
    if (profileEffectsDiv) {
      console.log('Found profile effects div');
      
      // Make sure the profile effects div has the right styling
      profileEffectsDiv.style.position = 'absolute';
      profileEffectsDiv.style.bottom = '0';
      profileEffectsDiv.style.left = '0';
      profileEffectsDiv.style.right = '0';
      profileEffectsDiv.style.pointerEvents = 'none';
      
      const innerDiv = profileEffectsDiv.querySelector('.inner__01370');
      
      if (innerDiv) {
        // Ensure inner div has correct styling
        innerDiv.style.position = 'relative';
        innerDiv.style.height = '300px';
        innerDiv.style.width = '300px';
        innerDiv.style.margin = '0 auto';
        
        // Clear any existing content
        while (innerDiv.firstChild) {
          innerDiv.removeChild(innerDiv.firstChild);
        }
        
        // Use local path if available
        const introEffectSrc = options.saveImagesLocally && localImageMap.profileEffect1 ? localImageMap.profileEffect1 : cdnUrlMap.profileEffect1;
        const idleEffectSrc = options.saveImagesLocally && localImageMap.profileEffect2 ? localImageMap.profileEffect2 : cdnUrlMap.profileEffect2;
        
        // Add intro effect with proper styling
        const introEffect = newDocument.createElement('img');
        introEffect.setAttribute('alt', 'Lofi Girl\'s desk setup appears, showing off her signature headphones, study lamp, laptop, notebook, and pens. All the essentials for a productive study session!');
        introEffect.setAttribute('src', introEffectSrc);
        introEffect.setAttribute('class', 'effect__01370');
        introEffect.setAttribute('data-original-type', 'replaced-base64-image');
        introEffect.style.position = 'absolute';
        introEffect.style.top = '0px';
        introEffect.style.left = '0px';
        introEffect.style.width = '300px';
        introEffect.style.height = 'auto';
        introEffect.style.zIndex = '1';
        innerDiv.appendChild(introEffect);
        
        // Add idle effect with proper styling
        const idleEffect = newDocument.createElement('img');
        idleEffect.setAttribute('alt', 'Lofi Girl\'s desk setup appears, showing off her signature headphones, study lamp, laptop, notebook, and pens. All the essentials for a productive study session!');
        idleEffect.setAttribute('src', idleEffectSrc);
        idleEffect.setAttribute('class', 'effect__01370');
        idleEffect.setAttribute('data-original-type', 'replaced-base64-image');
        idleEffect.style.position = 'absolute';
        idleEffect.style.top = '0px';
        idleEffect.style.left = '0px';
        idleEffect.style.width = '300px'; 
        idleEffect.style.height = 'auto';
        idleEffect.style.zIndex = '2';
        innerDiv.appendChild(idleEffect);
        
        console.log('- Added profile effect images with proper styling');
      }
    }
    
    // Fix avatar decorations in SVG elements
    const avatarDecorationSvgs = newDocument.querySelectorAll('svg.avatarDecoration__44b0c');
    avatarDecorationSvgs.forEach(svg => {
      console.log('Found avatar decoration SVG');
      
      // Set correct dimensions and positioning for decoration SVG
      svg.setAttribute('width', '108');
      svg.setAttribute('height', '96');
      svg.setAttribute('viewBox', '0 0 108 96');
      svg.setAttribute('style', 'position: absolute; top: -8px; left: -8px; pointer-events: none; z-index: 2;');
      
      // Update foreignObject dimensions and position
      const foreignObject = svg.querySelector('foreignObject');
      if (foreignObject) {
        foreignObject.setAttribute('x', '8');
        foreignObject.setAttribute('y', '8');
        foreignObject.setAttribute('width', '92');
        foreignObject.setAttribute('height', '92');
      }
      
      // Update decoration image styling
      const decorationImg = svg.querySelector('img.avatar__44b0c');
      if (decorationImg) {
        decorationImg.setAttribute('style', 'width: 108px; height: 96px; display: block; position: relative; z-index: 1; transform: scale(1.15); transform-origin: center center;');
      }
    });

    // Fix main avatar SVG elements
    const avatarSvgs = newDocument.querySelectorAll('svg.mask__44b0c');
    avatarSvgs.forEach(svg => {
      console.log('Found main avatar SVG');
      
      // Set correct dimensions for main avatar SVG
      svg.setAttribute('width', '92');
      svg.setAttribute('height', '92');
      svg.setAttribute('viewBox', '0 0 92 92');
      
      // Update foreignObject dimensions
      const foreignObject = svg.querySelector('foreignObject');
      if (foreignObject) {
        foreignObject.setAttribute('x', '0');
        foreignObject.setAttribute('y', '0');
        foreignObject.setAttribute('width', '80');
        foreignObject.setAttribute('height', '80');
      }
      
      // Update avatar image styling
      const avatarImg = svg.querySelector('img.avatar__44b0c');
      if (avatarImg) {
        avatarImg.setAttribute('style', 'width: 80px; height: 80px; display: block; border-radius: 50%;');
      }
    });

    // Fix wrapper dimensions
    const wrappers = newDocument.querySelectorAll('.wrapper__44b0c');
    wrappers.forEach(wrapper => {
      wrapper.setAttribute('style', 'width: 80px; height: 80px; position: relative; display: inline-block;');
    });
    
    // Add additional styles to ensure proper display
    console.log('Adding custom styles for proper display...');
    
    // Function to extract all classes and IDs from the document
    function extractSelectorsFromHTML(doc) {
      const selectors = {
        ids: new Set(),
        classes: new Set(),
        tags: new Set(),
        attributes: new Set(),
        svgElements: new Set(),
        dataAttributes: new Set()
      };
      
      // Function to process an element
      function processElement(element) {
        // Get element tag name
        const tagName = element.tagName.toLowerCase();
        selectors.tags.add(tagName);
        
        // Special handling for SVG elements
        if (element instanceof doc.defaultView.SVGElement || tagName === 'svg') {
          selectors.svgElements.add(tagName);
          // Add common SVG attributes
          ['fill', 'stroke', 'mask', 'clip-path', 'filter'].forEach(attr => {
            if (element.hasAttribute(attr)) {
              selectors.attributes.add(`[${attr}]`);
              selectors.attributes.add(`[${attr}="${element.getAttribute(attr)}"]`);
            }
          });
        }
        
        // Get classes
        if (element.classList && element.classList.length) {
          element.classList.forEach(cls => {
            selectors.classes.add(cls);
            // Add parent-child class combinations for better specificity matching
            if (element.parentElement && element.parentElement.classList.length) {
              element.parentElement.classList.forEach(parentCls => {
                selectors.classes.add(`${parentCls} ${cls}`);
              });
            }
          });
        }
        
        // Get ID
        if (element.id) {
          selectors.ids.add(element.id);
        }
        
        // Get all data attributes
        Array.from(element.attributes).forEach(attr => {
          if (attr.name.startsWith('data-')) {
            selectors.dataAttributes.add(attr.name);
            selectors.attributes.add(`[${attr.name}]`);
            if (attr.value) {
              selectors.attributes.add(`[${attr.name}="${attr.value}"]`);
            }
          }
        });
        
        // Get relevant attributes
        ['role', 'type', 'aria-label', 'aria-hidden', 'data-original-type', 'data-had-base64-bg'].forEach(attr => {
          if (element.hasAttribute(attr)) {
            selectors.attributes.add(`[${attr}]`);
            selectors.attributes.add(`[${attr}="${element.getAttribute(attr)}"]`);
          }
        });
        
        // Process children
        Array.from(element.children).forEach(child => processElement(child));
      }
      
      // Process the entire document
      processElement(doc.body);
      
      return selectors;
    }
    
    // Function to parse CSS and extract rules
    function parseCSSRules(styleContent) {
      const rules = [];
      
      // Split the CSS content into individual rules
      let currentRule = '';
      let braceCount = 0;
      let inComment = false;
      let inString = false;
      let stringChar = '';
      let inMediaQuery = false;
      let mediaQueryBraces = 0;
      
      for (let i = 0; i < styleContent.length; i++) {
        const char = styleContent[i];
        const nextChar = styleContent[i + 1];
        
        // Handle comments
        if (!inString && char === '/' && nextChar === '*') {
          inComment = true;
          i++; // Skip next char
          continue;
        }
        if (inComment && char === '*' && nextChar === '/') {
          inComment = false;
          i++; // Skip next char
          continue;
        }
        if (inComment) continue;
        
        // Handle strings
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && styleContent[i - 1] !== '\\') {
          inString = false;
        }
        
        // Count braces if not in a string
        if (!inString) {
          if (char === '{') {
            braceCount++;
            if (currentRule.trim().startsWith('@media')) {
              inMediaQuery = true;
              mediaQueryBraces = braceCount;
            }
          }
          if (char === '}') {
            braceCount--;
            if (inMediaQuery && braceCount < mediaQueryBraces) {
              inMediaQuery = false;
            }
          }
        }
        
        currentRule += char;
        
        // Rule is complete when braces are balanced and we're at the end or hit a closing brace
        if (braceCount === 0 && (currentRule.trim().length > 0) && (char === '}' || i === styleContent.length - 1)) {
          rules.push(currentRule.trim());
          currentRule = '';
        }
      }
      
      return rules;
    }
    
    // Function to check if a rule matches any of our selectors
    function isRuleNeeded(rule, selectors) {
      // Always keep @keyframes, @media, @supports, @font-face, and other at-rules
      if (/@(keyframes|media|supports|font-face|value|container|property|layer|import|charset)/.test(rule)) {
        return true;
      }
      
      // Get the selector part (everything before the first {)
      const selectorPart = rule.split('{')[0].trim();
      
      // Handle nested @media rules
      if (selectorPart.startsWith('@media')) {
        const mediaBody = rule.substring(rule.indexOf('{') + 1, rule.lastIndexOf('}'));
        const nestedRules = parseCSSRules(mediaBody);
        return nestedRules.some(nestedRule => isRuleNeeded(nestedRule, selectors));
      }
      
      // Split into individual selectors
      const individualSelectors = selectorPart.split(',').map(s => s.trim());
      
      // Check each selector
      return individualSelectors.some(selector => {
        // Keep root styles
        if (selector === ':root') return true;
        
        // Keep theme-related selectors
        if (selector.includes('theme-') || selector.includes('visual-refresh')) return true;
        
        // Keep SVG-related selectors
        if (selector.includes('svg') || /\[(?:mask|clip-path|filter)\]/.test(selector)) {
          return true;
        }
        
        // Check for matching IDs
        if (selector.includes('#')) {
          return Array.from(selectors.ids).some(id => selector.includes(`#${id}`));
        }
        
        // Check for matching classes with better specificity handling
        if (selector.includes('.')) {
          const selectorClasses = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
          return selectorClasses.every(cls => {
            const className = cls.substring(1); // Remove the dot
            return Array.from(selectors.classes).some(existingCls => 
              existingCls.split(' ').includes(className));
          });
        }
        
        // Check for matching tags
        const selectorTags = selector.match(/[a-zA-Z0-9-]+(?=[.#\[:]|$)/g) || [];
        if (selectorTags.some(tag => selectors.tags.has(tag))) {
          return true;
        }
        
        // Check for attribute selectors
        if (selector.includes('[')) {
          return Array.from(selectors.attributes).some(attr => selector.includes(attr));
        }
        
        // Check for data attributes
        if (selector.includes('data-')) {
          return Array.from(selectors.dataAttributes).some(attr => selector.includes(attr));
        }
        
        // Check for pseudo-classes and pseudo-elements on matching elements
        if (selector.includes(':')) {
          const baseSelector = selector.split(':')[0];
          return Array.from(selectors.tags).some(tag => baseSelector.includes(tag)) ||
                 Array.from(selectors.classes).some(cls => baseSelector.includes(`.${cls}`)) ||
                 Array.from(selectors.ids).some(id => baseSelector.includes(`#${id}`));
        }
        
        return false;
      });
    }
    
    // Extract all style elements
    console.log('Analyzing and filtering CSS rules...');
    const styleElements = Array.from(newDocument.getElementsByTagName('style'));
    const selectors = extractSelectorsFromHTML(newDocument);
    
    // Track CSS statistics
    let cssStats = {
      originalRules: 0,
      keptRules: 0,
      originalSize: 0,
      newSize: 0,
      mediaQueries: 0,
      keyframes: 0,
      svgRules: 0,
      themeRules: 0
    };
    
    // Process each style element
    styleElements.forEach(style => {
      const originalContent = style.textContent;
      cssStats.originalSize += originalContent.length;
      
      // Parse rules
      const rules = parseCSSRules(originalContent);
      cssStats.originalRules += rules.length;
      
      // Filter and categorize rules
      const neededRules = rules.filter(rule => {
        const isNeeded = isRuleNeeded(rule, selectors);
        if (isNeeded) {
          // Track statistics for different types of rules
          if (rule.includes('@keyframes')) {
            cssStats.keyframes++;
          } else if (rule.includes('@media')) {
            cssStats.mediaQueries++;
          } else if (rule.includes('svg') || /\[(?:mask|clip-path|filter)\]/.test(rule)) {
            cssStats.svgRules++;
          } else if (rule.includes('theme-')) {
            cssStats.themeRules++;
          }
        }
        return isNeeded;
      });
      
      cssStats.keptRules += neededRules.length;
      
      // Update style content with proper formatting
      const newContent = neededRules.map(rule => {
        // Format @media queries for better readability
        if (rule.startsWith('@media')) {
          const mediaQuery = rule.substring(0, rule.indexOf('{')).trim();
          const mediaBody = rule.substring(rule.indexOf('{') + 1, rule.lastIndexOf('}')).trim();
          const formattedBody = mediaBody.split('}').map(r => r.trim() + '}').join('\n  ').replace(/}$/, '');
          return `${mediaQuery} {\n  ${formattedBody}\n}`;
        }
        // Format @keyframes for better readability
        else if (rule.startsWith('@keyframes')) {
          const keyframesName = rule.substring(0, rule.indexOf('{')).trim();
          const keyframesBody = rule.substring(rule.indexOf('{') + 1, rule.lastIndexOf('}')).trim();
          const formattedBody = keyframesBody.split('}').map(r => r.trim() + '}').join('\n  ').replace(/}$/, '');
          return `${keyframesName} {\n  ${formattedBody}\n}`;
        }
        return rule;
      }).join('\n\n');
      
      cssStats.newSize += newContent.length;
      style.textContent = newContent;
    });
    
    // Add our custom styles with better organization
    const additionalStyles = newDocument.createElement('style');
    additionalStyles.textContent = `
      /* Theme Variables */
      :root {
        --background-primary: #36393f;
        --background-secondary: #2f3136;
        --background-tertiary: #202225;
        --text-normal: #dcddde;
        --interactive-normal: #b9bbbe;
        --header-primary: #fff;
        --header-secondary: #b9bbbe;
        --channels-default: #96989d;
      }
      
      /* Base Styles */
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: var(--background-tertiary);
        color: var(--text-normal);
        font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      
      /* Dialog Container */
      .discord-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.85);
      }
      
      /* Dialog Content */
      [role="dialog"] {
        background: var(--background-primary);
        border-radius: 4px;
        box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);
        position: relative;
        min-width: 440px;
        max-width: 660px;
        max-height: 720px;
        display: flex;
        flex-direction: column;
      }
      
      /* Image Handling */
      img[data-had-base64-bg="true"] {
        background-color: var(--background-secondary);
        border-radius: 50%;
      }
      
      img[data-original-type="replaced-base64-image"] {
        max-width: 100%;
        height: auto;
        display: inline-block;
      }
      
      .avatar__44b0c img[data-original-type="replaced-base64-image"],
      img.avatar__44b0c[data-original-type="replaced-base64-image"] {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .avatarDecoration__44b0c img[data-original-type="replaced-base64-image"],
      svg.avatarDecoration__44b0c foreignObject img {
        width: 108px;
        height: 96px;
        object-fit: contain;
      }
      
      .badge__8061a[data-original-type="replaced-base64-image"] {
        width: 24px;
        height: 24px;
      }
      
      .effect__01370[data-original-type="replaced-base64-image"] {
        width: 300px;
        height: auto;
        position: absolute;
      }
      
      /* SVG Elements */
      svg {
        display: block;
      }
      
      /* SVG Masks and Definitions */
      mask, clipPath, linearGradient, radialGradient, pattern, filter {
        display: none;
      }
      
      /* Avatar and Profile Components */
      .wrapper__44b0c {
        position: relative;
        display: inline-block;
        user-select: none;
      }
      
      .mask__44b0c {
        -webkit-mask-size: 100%;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        overflow: hidden;
      }
      
      .svg__44b0c {
        position: absolute;
        pointer-events: none;
        width: 100%;
        height: 100%;
        z-index: 1;
        overflow: visible !important;
      }
      
      .avatarStack__44b0c {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      
      /* Profile Effects */
      .profileEffects__01370 {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none;
        user-select: none;
        overflow: hidden;
      }
      
      .inner__01370 {
        display: block;
        position: relative;
        height: 300px;
        width: 300px;
        margin: 0 auto;
      }
      
      /* Scrollbars */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background-color: transparent;
        border-color: transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background-color: var(--background-tertiary);
        border-radius: 4px;
      }
      
      /* Accessibility */
      [aria-hidden="true"] {
        display: none;
      }
      
      /* Avatar decoration style fixes */
      .avatarDecoration__44b0c {
        pointer-events: none !important;
        z-index: 2 !important;
        display: block !important;
        position: absolute !important;
        left: -6px !important;  /* Adjust positioning to match Discord's original */
        top: -6px !important;   /* Adjust positioning to match Discord's original */
        width: 92px !important;
        height: 92px !important;
      }
      
      .avatarDecoration__44b0c img[data-original-type="replaced-base64-image"],
      svg.avatarDecoration__44b0c foreignObject img {
        width: 92px !important;
        height: 92px !important;
        object-fit: contain !important;
        display: block !important;
        position: relative !important;
        z-index: 1 !important;
        transform: scale(1.1) !important;
        transform-origin: center center !important;
      }
    `;
    
    // Add the additional styles as the first style element
    const firstStyle = newDocument.getElementsByTagName('style')[0];
    if (firstStyle) {
      firstStyle.parentNode.insertBefore(additionalStyles, firstStyle);
    } else {
      newDocument.head.appendChild(additionalStyles);
    }
    
    // Log CSS optimization statistics
    console.log('\nCSS Optimization Statistics:');
    console.log(`- Original rules: ${cssStats.originalRules}`);
    console.log(`- Kept rules: ${cssStats.keptRules} (${Math.round(cssStats.keptRules/cssStats.originalRules*100)}%)`);
    console.log(`- Original size: ${(cssStats.originalSize/1024).toFixed(2)}KB`);
    console.log(`- New size: ${(cssStats.newSize/1024).toFixed(2)}KB (${Math.round(cssStats.newSize/cssStats.originalSize*100)}%)`);
    console.log('\nRule Categories:');
    console.log(`- Media queries: ${cssStats.mediaQueries}`);
    console.log(`- Keyframes: ${cssStats.keyframes}`);
    console.log(`- SVG rules: ${cssStats.svgRules}`);
    console.log(`- Theme rules: ${cssStats.themeRules}`);
    
    // Remove any existing CSP meta tags to avoid conflicts
    console.log('Handling Content-Security-Policy...');
    const existingCspTags = Array.from(newDocument.querySelectorAll('meta[http-equiv="Content-Security-Policy"], meta[http-equiv="content-security-policy"]'));
    if (existingCspTags.length > 0) {
      console.log(`- Removing ${existingCspTags.length} existing CSP meta tags`);
      existingCspTags.forEach(tag => tag.parentNode.removeChild(tag));
    }
    
    // Extract all base64 fonts and save them locally
    if (options.saveImagesLocally) {
      console.log('Processing base64 fonts...');
      const styleElements = Array.from(newDocument.getElementsByTagName('style'));
      const fontRegex = /url\(data:font\/woff2;base64,([^)]+)\)/g;
      let fontCounter = 0;
      
      // Create fonts directory
      const path = require('path');
      const fontsDir = path.join(path.dirname(outputPath), 'fonts');
      if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir, { recursive: true });
      }
      
      // Process each style element
      styleElements.forEach(style => {
        const cssContent = style.textContent;
        let match;
        let modifiedCss = cssContent;
        
        // Find all base64 fonts
        while ((match = fontRegex.exec(cssContent)) !== null) {
          fontCounter++;
          const base64Data = match[1];
          const fontFilename = `discord-font-${fontCounter}.woff2`;
          const fontPath = path.join(fontsDir, fontFilename);
          
          // Save font file
          try {
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(fontPath, buffer);
            console.log(`- Saved font: ${fontFilename}`);
            
            // Replace in CSS
            modifiedCss = modifiedCss.replace(
              `url(data:font/woff2;base64,${base64Data})`,
              `url('./fonts/${fontFilename}')`
            );
          } catch (err) {
            console.error(`- Error saving font ${fontFilename}: ${err.message}`);
          }
        }
        
        // Update the style content
        style.textContent = modifiedCss;
      });
      
      console.log(`Processed ${fontCounter} base64 fonts`);
    }
    
    // Create a more permissive CSP
    const cspMeta = newDocument.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    
    // Set appropriate CSP based on image source
    if (options.disableCsp) {
      // Completely disable CSP with most permissive settings
      cspMeta.setAttribute('content', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src * 'unsafe-inline'; img-src * data: blob:; frame-src *; style-src * 'unsafe-inline';");
      console.log('- CSP restrictions disabled - all content will be allowed');
    } else if (options.saveImagesLocally) {
      cspMeta.setAttribute('content', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; child-src 'none'; frame-src 'none';");
      console.log('- Added restrictive CSP for local images only');
    } else {
      // More permissive CSP that allows external Discord CDN content
      cspMeta.setAttribute('content', "default-src 'self'; img-src 'self' data: https://*.discordapp.com https://*.discord.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; child-src 'none'; frame-src 'none';");
      console.log('- Added permissive CSP allowing Discord CDN images');
    }
    
    // Also add proper viewport and encoding meta tags
    const viewportMeta = newDocument.createElement('meta');
    viewportMeta.setAttribute('name', 'viewport');
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    
    const encodingMeta = newDocument.createElement('meta');
    encodingMeta.setAttribute('charset', 'UTF-8');
    
    // Add meta tags to head
    newDocument.head.insertBefore(encodingMeta, newDocument.head.firstChild);
    newDocument.head.insertBefore(viewportMeta, newDocument.head.childNodes[1] || null);
    newDocument.head.insertBefore(cspMeta, newDocument.head.childNodes[2] || null);
    
    // Add a title
    if (!newDocument.title) {
      const titleElement = newDocument.createElement('title');
      titleElement.textContent = 'Discord Conversation';
      newDocument.head.appendChild(titleElement);
    }
    
    // Get the serialized HTML
    let htmlOutput = `<!DOCTYPE html>\n${newDocument.documentElement.outerHTML}`;
    
    // If using local images, ensure all CDN URLs are replaced with local paths
    if (options.saveImagesLocally) {
      console.log('Ensuring all CDN URLs are replaced with local paths...');
      
      // Replace all remaining CDN URLs with local paths
      Object.entries(localImageMap).forEach(([type, localPath]) => {
        const cdnUrl = cdnUrlMap[type];
        if (cdnUrl && localPath && cdnUrl !== localPath) {
          // Escape special characters in the CDN URL for use in regex
          const escapedCdnUrl = cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedCdnUrl, 'g');
          
          // Count replacements
          const beforeCount = (htmlOutput.match(regex) || []).length;
          htmlOutput = htmlOutput.replace(regex, localPath);
          const afterCount = (htmlOutput.match(new RegExp(localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          
          // Log the number of replacements
          if (beforeCount > 0) {
            console.log(`- Replaced ${beforeCount} instances of ${cdnUrl} with ${localPath}`);
          }
        }
      });
    }
    
    // Write the output file
    try {
      fs.writeFileSync(outputPath, htmlOutput);
      
      // Report statistics
      const originalSize = Buffer.byteLength(data, 'utf8');
      const newSize = Buffer.byteLength(htmlOutput, 'utf8');
      const reduction = ((originalSize - newSize) / originalSize) * 100;
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      
      console.log(`\nExtraction completed in ${processingTime.toFixed(2)} seconds`);
      console.log(`Output saved to: ${outputPath}`);
      
      console.log(`\nFile size reduction: ${reduction.toFixed(2)}%`);
      console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`New: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Saved: ${((originalSize - newSize) / 1024 / 1024).toFixed(2)} MB`);
      
      // Report base64 image replacement stats
      if (base64Stats.count > 0) {
        console.log(`\nBase64 Image Replacement Statistics:`);
        console.log(`Total base64 images found: ${base64Stats.count}`);
        console.log(`Images replaced with CDN URLs: ${base64Stats.replaced} (${Math.round(base64Stats.replaced/base64Stats.count*100)}%)`);
        console.log(`Images removed completely: ${base64Stats.count - base64Stats.replaced}`);
        console.log(`Total base64 data size: ${(base64Stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
        
        // Report by type if there's data
        const types = Object.entries(base64Stats.byType)
          .filter(([_, size]) => size > 0)
          .sort(([_, sizeA], [__, sizeB]) => sizeB - sizeA);
        
        if (types.length > 0) {
          console.log(`\nBase64 data by type:`);
          types.forEach(([type, size]) => {
            const readableType = type
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            console.log(`- ${readableType}: ${(size / 1024 / 1024).toFixed(2)} MB`);
          });
        }
        
        console.log(`\nCDN URLs used as replacements:`);
        Object.entries(cdnUrlMap).forEach(([type, url]) => {
          console.log(`- ${type}: ${url}`);
        });
      }
      
      console.log(`\nOpen the file in your browser to view the extracted dialog.`);
      
      // Add instructions for image handling
      if (options.saveImagesLocally) {
        console.log(`Images are saved locally in the 'images' directory.`);
      } else if (!options.disableCsp) {
        console.log(`\nIf you have CSP issues loading images, try one of these options:`);
        console.log(`1. Run with --save-images to download images locally:`);
        console.log(`   node extract-dialog-only.js "${inputPath}" "${outputPath}" "${targetSelector}" --save-images`);
        console.log(`2. Or disable CSP completely (less secure but simpler):`);
        console.log(`   node extract-dialog-only.js "${inputPath}" "${outputPath}" "${targetSelector}" --disable-csp`);
      }
    } catch (writeErr) {
      console.error('Error writing output file:', writeErr.message);
      console.log('Check that you have permission to write to the output location.');
    }
  });
} catch (e) {
  console.error('Critical error:', e.message);
} 