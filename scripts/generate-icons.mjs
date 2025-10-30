import sharp from 'sharp';
import { mkdirSync, existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const SRC = resolve('src/mwalimuicon.jpeg');
const OUT = resolve('public');

if (!existsSync(SRC)) {
  console.error('Source image not found at src/mwalimuicon.jpeg');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

async function run() {
  await sharp(SRC)
    .resize(192, 192, { fit: 'cover' })
    .png({ quality: 90 })
    .toFile(resolve(OUT, 'logo192.png'));

  await sharp(SRC)
    .resize(512, 512, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(resolve(OUT, 'logo512.png'));

  await sharp(SRC)
    .resize(48, 48, { fit: 'cover' })
    .toFile(resolve(OUT, 'favicon.ico'));

  console.log('Icons generated: public/logo192.png, public/logo512.png, public/favicon.ico');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


