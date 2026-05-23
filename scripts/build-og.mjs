// Generate /public/og.png — the social media preview card.
// Rasterizes an inline SVG (1200x630) to PNG via sharp.
//
// Usage: node scripts/build-og.mjs

import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outPath = resolve(root, 'public/og.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="#FFFFFF"/>

	<!-- Lambda mark (top-left) -->
	<path d="M 110 72.5 L 77.5 127.5 M 95 97.5 L 125 127.5"
	      stroke="#111111" stroke-width="10" fill="none"/>

	<!-- Title -->
	<text x="60" y="400"
	      font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
	      font-size="200" font-weight="700" fill="#111111"
	      letter-spacing="-6">Lemma</text>

	<!-- Subtitle -->
	<text x="60" y="470"
	      font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
	      font-size="36" font-weight="400" fill="#666666">Notes zu Mathematik, Physik und Elektrotechnik</text>

	<!-- Rule -->
	<line x1="60" y1="550" x2="1140" y2="550" stroke="#111111" stroke-width="1"/>

	<!-- URL (bottom-right) -->
	<text x="1140" y="595"
	      font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
	      font-size="24" font-weight="400" fill="#666666"
	      text-anchor="end">lemmanotes.github.io</text>
</svg>`;

const png = await sharp(Buffer.from(svg))
	.png({ compressionLevel: 9 })
	.toBuffer();

writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
