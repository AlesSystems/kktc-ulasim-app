/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Basit SVG icon (otobüs temalı)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2563eb" rx="128"/>
  <g transform="translate(96, 96)">
    <!-- Otobüs gövdesi -->
    <rect x="40" y="60" width="240" height="200" rx="20" fill="#ffffff"/>
    <!-- Cam -->
    <rect x="60" y="80" width="80" height="80" rx="8" fill="#dbeafe"/>
    <rect x="180" y="80" width="80" height="80" rx="8" fill="#dbeafe"/>
    <!-- Tekerlekler -->
    <circle cx="100" cy="280" r="30" fill="#1e3a8a"/>
    <circle cx="100" cy="280" r="15" fill="#60a5fa"/>
    <circle cx="220" cy="280" r="30" fill="#1e3a8a"/>
    <circle cx="220" cy="280" r="15" fill="#60a5fa"/>
    <!-- Detaylar -->
    <rect x="150" y="200" width="20" height="60" rx="4" fill="#93c5fd"/>
  </g>
</svg>`;

const iconsDir = path.join(__dirname, 'public', 'icons');

// Icon boyutları
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating icon files...');

// Her boyut için SVG dosyası oluştur
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png.svg`;
  const filepath = path.join(iconsDir, filename);
  
  // SVG'yi boyuta göre ölçeklendir
  const scaledSvg = svgContent.replace('viewBox="0 0 512 512"', `viewBox="0 0 512 512" width="${size}" height="${size}"`);
  
  fs.writeFileSync(filepath, scaledSvg);
  console.log(`Created: ${filename}`);
});

// Apple touch icon (180x180)
const appleTouchIcon = path.join(iconsDir, 'apple-touch-icon.png.svg');
const scaledAppleSvg = svgContent.replace('viewBox="0 0 512 512"', 'viewBox="0 0 512 512" width="180" height="180"');
fs.writeFileSync(appleTouchIcon, scaledAppleSvg);
console.log('Created: apple-touch-icon.png.svg');

console.log('\n⚠️ NOTE: These are temporary SVG files with .png.svg extension.');
console.log('For production, please replace them with actual PNG images.');
console.log('You can use tools like:');
console.log('- Inkscape: inkscape --export-type=png input.svg');
console.log('- ImageMagick: convert input.svg output.png');
console.log('- Online tools: https://svgtopng.com/ or https://cloudconvert.com/');
