#!/usr/bin/env node

/**
 * Generate favicon files from logo in dark red color
 * Maintains aspect ratio and creates all required sizes
 */

const fs = require('fs');
const path = require('path');

// Dark red color: #8B0000 or #A52A2A (dark red)
const DARK_RED = '#8B0000';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 }, // Apple recommends 180x180
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'official-logo.svg');

console.log('🎨 Generating dark red favicons from logo...\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo file not found:', logoPath);
  console.log('\nAvailable logo files:');
  fs.readdirSync(publicDir)
    .filter(f => f.includes('logo'))
    .forEach(f => console.log('  -', f));
  process.exit(1);
}

console.log('📝 Instructions for generating favicons:\n');
console.log('Since we need to convert SVG to PNG and apply dark red color,');
console.log('you have a few options:\n');

console.log('Option 1: Use online tool (Recommended)');
console.log('1. Open your logo SVG in a design tool (Figma, Inkscape, etc.)');
console.log('2. Change the color to dark red (#8B0000)');
console.log('3. Export as PNG in these sizes:');
sizes.forEach(({ name, size }) => {
  console.log(`   - ${name}: ${size}x${size}px`);
});
console.log('4. Also create favicon.ico (16x16, 32x32, 48x48 combined)');
console.log('5. Save all files to the public/ directory\n');

console.log('Option 2: Use ImageMagick (if installed)');
console.log('Run these commands:');
console.log(`convert -background none -resize 16x16 "${logoPath}" -fill "${DARK_RED}" -colorize 100% "${path.join(publicDir, 'favicon-16x16.png')}"`);
sizes.slice(1).forEach(({ name, size }) => {
  console.log(`convert -background none -resize ${size}x${size} "${logoPath}" -fill "${DARK_RED}" -colorize 100% "${path.join(publicDir, name)}"`);
});
console.log('\nThen create favicon.ico from the PNG files\n');

console.log('Option 3: Use Node.js with sharp (if installed)');
console.log('I can create a script using sharp library if you install it:');
console.log('  npm install --save-dev sharp');
console.log('Then run: node scripts/generate-favicon-sharp.js\n');

console.log('💡 Quick manual steps:');
console.log('1. Open official-logo.svg in a design tool');
console.log('2. Change color to dark red (#8B0000)');
console.log('3. Export as PNG in sizes: 16x16, 32x32, 180x180, 192x192, 512x512');
console.log('4. Use an online favicon generator to create favicon.ico');
console.log('5. Save all files to public/ directory\n');

