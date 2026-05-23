// Generate a GitHub profile avatar (500x500 PNG) from an inline SVG.
// Saves to scripts/avatar.png — manually upload to github.com → Settings → Profile.
//
// Usage: node scripts/build-avatar.mjs

import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, 'avatar.png');

// Centered lambda in a 500x500 square. Geometry matches the favicon, scaled up
// and positioned with breathing room so it looks balanced as both a square and
// a circle (GitHub crops avatars to a circle in most UI contexts).
// Path is the favicon lambda (32x32 viewBox, geometry M20,5 L7,27 + M14,15 L26,27)
// scaled by ~15.9 and translated so its bounding box is centered in the 500x500
// canvas. Stroke width scales accordingly.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
	<rect width="500" height="500" fill="#FFFFFF"/>
	<path
		d="M 307 75 L 100 425 M 211 234 L 402 425"
		stroke="#111111"
		stroke-width="60"
		stroke-linecap="butt"
		fill="none"
	/>
</svg>`;

const png = await sharp(Buffer.from(svg))
	.png({ compressionLevel: 9 })
	.toBuffer();

writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
