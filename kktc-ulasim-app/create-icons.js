/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// PNG header ve basit mavi kare oluştur (gerçek PNG formatı)
function createSimplePNG(size) {
  // Bu basit bir placeholder PNG oluşturur
  // Gerçek üretimde profesyonel bir icon kullanılmalı
  
  const canvas = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2563eb" rx="64"/>
  <g transform="translate(96, 96)">
    <rect x="40" y="60" width="240" height="200" rx="20" fill="#ffffff"/>
    <rect x="60" y="80" width="80" height="80" rx="8" fill="#dbeafe"/>
    <rect x="180" y="80" width="80" height="80" rx="8" fill="#dbeafe"/>
    <circle cx="100" cy="280" r="30" fill="#1e3a8a"/>
    <circle cx="100" cy="280" r="15" fill="#60a5fa"/>
    <circle cx="220" cy="280" r="30" fill="#1e3a8a"/>
    <circle cx="220" cy="280" r="15" fill="#60a5fa"/>
    <rect x="150" y="200" width="20" height="60" rx="4" fill="#93c5fd"/>
  </g>
</svg>`;
  
  return canvas;
}

const iconsDir = path.join(__dirname, 'public', 'icons');
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating SVG icon files (as PNG placeholders)...\n');

// SVG dosyalarını oluştur (tarayıcılar bunları da kullanabilir)
sizes.forEach(size => {
  const svgContent = createSimplePNG(size);
  const filepath = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`✓ Created: icon-${size}x${size}.png`);
});

// Apple touch icon
const appleTouchIcon = path.join(iconsDir, 'apple-touch-icon.png');
const appleSvg = createSimplePNG(180);
fs.writeFileSync(appleTouchIcon, appleSvg);
console.log(`✓ Created: apple-touch-icon.png`);

console.log('\n📝 Note: Icons are currently SVG files saved as .png');
console.log('Modern browsers support SVG images in manifest.json');
console.log('For best compatibility, convert to actual PNG using:');
console.log('  - https://realfavicongenerator.net/');
console.log('  - https://www.favicon-generator.org/');
