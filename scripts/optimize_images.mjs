import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const DIR = fileURLToPath(new URL('../public/images/', import.meta.url));
const files = readdirSync(DIR).filter(f => /\.jpe?g$/i.test(f));

let before = 0, after = 0;
for (const f of files) {
  const p = join(DIR, f);
  const src = readFileSync(p);
  before += src.length;
  const buf = await sharp(src)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  writeFileSync(p, buf);
  after += buf.length;
  const webp = await sharp(buf).webp({ quality: 70 }).toBuffer();
  writeFileSync(p.replace(/\.jpe?g$/i, '.webp'), webp);
}
console.log(`jpg: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB across ${files.length} files`);
