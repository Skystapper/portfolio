# Discord Dialog Extractor

This script extracts a specific dialog div from a large Discord HTML file exported using the SingleFile extension.

## Problem

The HTML file saved by SingleFile is extremely large (22,000+ lines) and contains a lot of unnecessary code. This script extracts just the dialog with class `focusLock__49fc1` and all its associated styles and scripts.

## Approaches

We provide four different approaches for extraction:

### 1. CSS/JS Selective Extraction (extract-discord-div.js)

This approach extracts the target div and only the CSS/JS that applies to it:

1. Locates the target div with class `focusLock__49fc1`
2. Recursively collects all classes and IDs used in the div's contents
3. Extracts only the CSS rules that apply to these classes and IDs, including:
   - Media queries affecting these elements
   - Keyframe animations used by these elements
   - Font-face declarations
   - CSS root variables
4. Creates a new HTML file with just the necessary content

### 2. Advanced Selective Extraction (extract-advanced.js)

Similar to the first approach but with command-line options for specifying custom selectors and paths.

### 3. HTML-Only Extraction (extract-dialog-only.js)

This approach keeps all CSS and JS but only extracts the target div and its parent hierarchy:

1. Locates the target div with class `focusLock__49fc1`
2. Preserves all parent elements with their attributes (for CSS inheritance)
3. Removes unnecessary sibling elements
4. Keeps the entire `<head>` section with all CSS and JS intact
5. Results in a cleaner HTML structure while maintaining full styling and functionality

### 4. Final Solution (extract-dialog-final.js)

This approach provides the most reliable extraction with proper styling:

1. Extracts all CSS and JavaScript from the original file
2. Finds the dialog element by searching for role="dialog" or the focusLock class
3. Adds custom CSS to ensure proper styling, including Discord theme colors
4. Creates a new HTML file with only the necessary components
5. Achieves approximately 75% file size reduction while maintaining visual fidelity

This is the recommended approach for most users as it provides the best balance between file size reduction and visual fidelity.

## Installation

```
npm install
```

For global installation (allows using the CLI from anywhere):

```
npm install -g .
discord-extractor --help
```

## Usage

### CLI Interface (Recommended)

The easiest way to use the Discord Dialog Extractor is through the CLI interface:

#### On Windows

```
extract.bat --input "path/to/input.html" --output "path/to/output.html" --method final
```

Or use shorthand options:

```
extract.bat -i "path/to/input.html" -o "path/to/output.html" -m simple
```

#### Using Node directly

```
npm run extract -- --input "path/to/input.html" --method final
```

For help on available options:

```
node extract-dialog-cli.js --help
```

### Final Solution (Recommended)

#### On Windows

1. Use the batch file:
   ```
   extract-final.bat
   ```

2. To specify a custom input file:
   ```
   extract-final.bat "path/to/input.html"
   ```

3. To specify both input and output:
   ```
   extract-final.bat "path/to/input.html" "path/to/output.html"
   ```

#### Using Node directly

1. Run the script:
   ```
   npm run extract-final
   ```

2. To specify custom input/output paths:
   ```
   node extract-dialog-final.js "path/to/input.html" "path/to/output.html"
   ```

### HTML-Only Extraction

#### On Windows

1. Use the batch file:
   ```
   extract-dialog-only.bat
   ```

2. To specify a custom input file:
   ```
   extract-dialog-only.bat "path/to/input.html"
   ```

3. To specify both input and output:
   ```
   extract-dialog-only.bat "path/to/input.html" "path/to/output.html"
   ```

4. To specify a custom selector:
   ```
   extract-dialog-only.bat "path/to/input.html" "path/to/output.html" ".myCustomClass"
   ```

5. To save images locally to avoid CSP restrictions:
   ```
   extract-dialog-only.bat "path/to/input.html" "path/to/output.html" ".myCustomClass" --save-images
   ```

6. To completely disable CSP restrictions:
   ```
   extract-dialog-only.bat "path/to/input.html" "path/to/output.html" ".myCustomClass" --disable-csp
   ```

7. Or use the dedicated batch file for CSP-disabled extraction:
   ```
   extract-with-disable-csp.bat "path/to/input.html"
   ```

8. To fix avatar decorations while disabling CSP:
   ```
   extract-with-fixed-avatars.bat "path/to/input.html"
   ```

#### Using Node directly

1. Run the script:
   ```
   npm run extract-dialog-only
   ```

2. To specify custom input/output paths and selector:
   ```
   node extract-dialog-only.js "path/to/input.html" "path/to/output.html" ".myCustomClass"
   ```

3. To save images locally or disable CSP:
   ```
   node extract-dialog-only.js "path/to/input.html" "path/to/output.html" ".myCustomClass" --save-images
   node extract-dialog-only.js "path/to/input.html" "path/to/output.html" ".myCustomClass" --disable-csp
   ```

### CSS/JS Selective Extraction

#### On Windows

1. Use the batch file:
   ```
   extract.bat
   ```

2. To specify a custom input file:
   ```
   extract.bat "path/to/input.html"
   ```

3. To specify both input and output:
   ```
   extract.bat "path/to/input.html" "path/to/output.html"
   ```

#### Using Node directly

1. Run the script:
   ```
   npm run extract
   ```

2. By default, it looks for:
   - Input: `C:/Users/ASUS/Downloads/(1404) Discord ｜ Profiles ｜ User Settings (5_14_2025 9：01：27 PM).html`
   - Output: `./extracted-discord-dialog.html`

3. To specify custom input/output paths:
   ```
   node extract-discord-div.js "path/to/input.html" "path/to/output.html"
   ```

### Advanced Extraction

The advanced version allows you to specify a custom selector for the element you want to extract.

#### On Windows

1. Use the advanced batch file:
   ```
   extract-advanced.bat
   ```

2. To get help:
   ```
   extract-advanced.bat --help
   ```

3. To specify a custom selector:
   ```
   extract-advanced.bat --selector ".myCustomClass"
   ```

4. To specify input, output, and selector:
   ```
   extract-advanced.bat --input "path/to/input.html" --output "path/to/output.html" --selector ".myCustomClass"
   ```

#### Using Node directly

1. Run the advanced script:
   ```
   npm run extract-advanced
   ```

2. To specify a custom selector:
   ```
   node extract-advanced.js --selector ".myCustomClass"
   ```

3. To see all available options:
   ```
   node extract-advanced.js --help
   ```

## Features

- Handles special characters in file paths
- Provides helpful error messages when files can't be found
- Suggests potential dialog classes if the target class isn't found
- Reports the file size reduction after extraction
- Advanced version supports custom selectors via command-line arguments
- Multiple extraction approaches for different needs:
  - CSS/JS selective extraction for maximum size reduction
  - HTML-only extraction for maintaining full styling with cleaner HTML

## Results

Using the CSS/JS selective approach, we achieved an 89.91% file size reduction, reducing a 21.28 MB HTML file to just 2.15 MB while preserving the functionality of the extracted dialog.

The HTML-only approach typically results in a smaller file size reduction but guarantees all styling and functionality is preserved.

Our final approach (extract-dialog-final.js) achieves approximately 75% file size reduction while maintaining full visual fidelity, including background colors, profile banners, and input styling.

## Customization

If you need to extract a different div, modify the target selector when calling the script or use the advanced version with custom selectors.

## Demo and Testing

To quickly test the different approaches:

1. Download a Discord profile page using the SingleFile extension
2. Run the desired batch file:
   ```
   extract-final.bat "path/to/your/discord-file.html"
   ```
3. Open the resulting file in your browser

Comparison of approaches:
- **extract-discord-div.js**: Greatest file size reduction (89%), may have some styling issues
- **extract-dialog-only.js**: Moderate file size reduction with better styling preservation
- **extract-dialog-simple.js**: Simple regex-based approach, good for troubleshooting
- **extract-dialog-final.js**: Best visual fidelity with custom styling, recommended for most users

## Troubleshooting

If you encounter any issues:

1. Check that the input file exists and is accessible
2. Ensure you have Node.js installed
3. Try running `npm install` to update dependencies
4. If the dialog isn't found, try using the advanced version with a custom selector
5. For style issues, use the final approach which includes custom CSS

## Content Security Policy (CSP) Handling

This script offers three approaches to handle Content Security Policy for loading Discord CDN resources:

1. **Default Mode**: Uses a restrictive CSP that allows loading images only from the local domain and data URLs. This may cause some Discord CDN images to not load properly.

2. **--save-images Mode**: Downloads all Discord CDN images locally to the 'images' directory and updates references in the HTML. This creates a completely self-contained HTML file that works offline without CSP issues.

3. **--disable-csp Mode**: Completely disables CSP restrictions, allowing any content to load from any source. This is the simplest approach but may be less secure for untrusted content.

To use these options:

```
# Save images locally
node extract-dialog-only.js "input.html" "output.html" ".selector" --save-images

# Disable CSP completely
node extract-dialog-only.js "input.html" "output.html" ".selector" --disable-csp

# Or use the dedicated batch file
extract-with-disable-csp.bat "input.html"
```

The --disable-csp option is recommended if you want to directly view Discord CDN content without downloading images locally.

### Known Issues and Fixes

#### Avatar Decorations Not Visible

If avatar decorations aren't visible in the extracted file, use the dedicated batch file that fixes this issue:

```
extract-with-fixed-avatars.bat "path/to/input.html"
```

This applies CSS fixes and corrects the SVG mask implementation to ensure avatar decorations display properly.

#### Content Security Policy (CSP) Blocking External Images

If you encounter issues with Discord CDN images not loading due to Content Security Policy restrictions, you have three options:

1. **Save Images Locally (Recommended for Offline Use)**
   ```
   extract-dialog-only.bat "path/to/input.html" "path/to/output.html" ".myCustomClass" --save-images
   ```
   This downloads all images locally and references them in the HTML file.

2. **Disable CSP Completely (Simplest Solution)**
   ```
   extract-with-disable-csp.bat "path/to/input.html"
   ```
   This removes all Content Security Policy restrictions, allowing external resources to load.

3. **Fix Both CSP and Avatar Decorations**
   ```
   extract-with-fixed-avatars.bat "path/to/input.html"
   ```
   This disables CSP and applies fixes for avatar decorations.

The --disable-csp option is recommended if you want to directly view Discord CDN content without downloading images locally. 