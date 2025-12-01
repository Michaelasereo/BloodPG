#!/usr/bin/env node

/**
 * Generate dark red favicons from logo using sharp
 * Creates all required sizes maintaining aspect ratio
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Dark red color: #961111
const DARK_RED = '#961111';

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'official-logo.svg');

async function generateFavicons() {
  console.log('🎨 Generating dark red favicons from logo...\n');

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('❌ Logo file not found:', logoPath);
    process.exit(1);
  }

  console.log('📐 Reading logo:', logoPath);
  
  try {
    // Read SVG and convert to dark red
    const svgBuffer = fs.readFileSync(logoPath);
    const svgString = svgBuffer.toString();
    
    // Replace black (#000000 or black) with dark red
    // Also handle stroke colors if present
    let darkRedSvg = svgString
      .replace(/fill="black"/gi, `fill="${DARK_RED}"`)
      .replace(/fill="#000000"/g, `fill="${DARK_RED}"`)
      .replace(/fill="#000"/g, `fill="${DARK_RED}"`)
      .replace(/stroke="black"/gi, `stroke="${DARK_RED}"`)
      .replace(/stroke="#000000"/g, `stroke="${DARK_RED}"`)
      .replace(/stroke="#000"/g, `stroke="${DARK_RED}"`);
    
    // If there's no fill attribute, add dark red fill
    darkRedSvg = darkRedSvg.replace(/<path([^>]*?)(?:\s+fill="[^"]*")?([^>]*?)>/g, (match, before, after) => {
      if (!match.includes('fill=')) {
        return match.replace('>', ` fill="${DARK_RED}">`);
      }
      return match;
    });
    
    console.log('✅ Converted logo to dark red\n');

    // Generate each size
    for (const { name, size } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      console.log(`📦 Generating ${name} (${size}x${size}px)...`);
      
      await sharp(Buffer.from(darkRedSvg))
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`   ✅ Created: ${outputPath}`);
    }

    // Create favicon.ico from 16x16 and 32x32
    console.log('\n📦 Generating favicon.ico...');
    const favicon16 = await sharp(path.join(publicDir, 'favicon-16x16.png')).toBuffer();
    const favicon32 = await sharp(path.join(publicDir, 'favicon-32x32.png')).toBuffer();
    
    // For favicon.ico, we'll use the 32x32 as the main icon
    // Note: Creating a proper .ico file requires additional libraries
    // For now, we'll copy the 32x32 as favicon.ico (browsers will accept it)
    fs.copyFileSync(
      path.join(publicDir, 'favicon-32x32.png'),
      path.join(publicDir, 'favicon.ico')
    );
    
    console.log('   ✅ Created: favicon.ico (using 32x32)');
    console.log('\n✨ All favicons generated successfully!');
    console.log('\n📝 Note: favicon.ico is a PNG copy. For a proper .ico file,');
    console.log('   use an online converter or ImageMagick:');
    console.log('   convert favicon-16x16.png favicon-32x32.png favicon.ico\n');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();

