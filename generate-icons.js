import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgBuffer = fs.readFileSync(path.join(__dirname, 'icon.svg'));

async function generate() {
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(__dirname, 'icon-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(__dirname, 'icon-512x512.png'));
  await sharp(svgBuffer).resize(64, 64).png().toFile(path.join(__dirname, 'favicon.png'));

  // Also update android mipmap icons if directory exists
  const androidResDir = path.join(__dirname, 'android/app/src/main/res');
  if (fs.existsSync(androidResDir)) {
    const densities = [
      { name: 'mipmap-mdpi', size: 48 },
      { name: 'mipmap-hdpi', size: 72 },
      { name: 'mipmap-xhdpi', size: 96 },
      { name: 'mipmap-xxhdpi', size: 144 },
      { name: 'mipmap-xxxhdpi', size: 192 }
    ];
    for (const d of densities) {
      const dir = path.join(androidResDir, d.name);
      if (fs.existsSync(dir)) {
        await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(dir, 'ic_launcher.png'));
        await sharp(svgBuffer).resize(d.size, d.size).png().toFile(path.join(dir, 'ic_launcher_round.png'));
      }
    }
  }
  console.log('Icons generated successfully!');
}

generate().catch(console.error);
