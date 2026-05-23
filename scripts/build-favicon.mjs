// Regenerate /public/favicon.ico from /public/favicon.svg.
// Builds an ICO container that holds PNG variants at 16x16, 32x32, and 48x48.
//
// Usage: node scripts/build-favicon.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'public/favicon.svg');
const icoPath = resolve(root, 'public/favicon.ico');

const svg = readFileSync(svgPath);
const sizes = [16, 32, 48];

const pngs = await Promise.all(
	sizes.map((size) =>
		sharp(svg)
			.resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
			.png({ compressionLevel: 9 })
			.toBuffer(),
	),
);

// ICONDIR header (6 bytes): reserved, type, count.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

// ICONDIRENTRY x N (16 bytes each).
const entries = Buffer.alloc(16 * sizes.length);
let offset = 6 + 16 * sizes.length;
for (let i = 0; i < sizes.length; i++) {
	const size = sizes[i];
	const pngSize = pngs[i].length;
	const e = i * 16;
	entries.writeUInt8(size === 256 ? 0 : size, e + 0); // width  (0 = 256)
	entries.writeUInt8(size === 256 ? 0 : size, e + 1); // height (0 = 256)
	entries.writeUInt8(0, e + 2); // colors in palette (0 for truecolor)
	entries.writeUInt8(0, e + 3); // reserved
	entries.writeUInt16LE(1, e + 4); // color planes
	entries.writeUInt16LE(32, e + 6); // bits per pixel
	entries.writeUInt32LE(pngSize, e + 8); // image data size
	entries.writeUInt32LE(offset, e + 12); // image data offset
	offset += pngSize;
}

const ico = Buffer.concat([header, entries, ...pngs]);
writeFileSync(icoPath, ico);

console.log(`Wrote ${icoPath} (${ico.length} bytes, sizes: ${sizes.join(', ')})`);
