import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const source = 'public/assets/vanguard-logo-source-backup.png';
await mkdir('public/screenshots', { recursive: true });

await sharp(source).resize(512, 512, { fit: 'inside' }).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile('public/assets/vanguard-logo.png');

const { data, info } = await sharp(source).resize(512, 512).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let index = 0; index < data.length; index += 4) {
  const brightness = Math.max(data[index], data[index + 1], data[index + 2]);
  data[index + 3] = brightness < 18 ? 0 : Math.min(255, Math.max(0, (brightness - 10) * 14));
}
await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile('public/assets/vanguard-logo-transparent.png');

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#050706"/><path d="M0 525L360 165H560L200 525Z" fill="#47b07b" opacity=".07"/>
  <path d="M1200 90L840 450H640L1000 90Z" fill="#47b07b" opacity=".07"/>
  <text x="690" y="255" fill="#f5faf7" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="62">Vanguard Indicator</text>
  <text x="690" y="330" fill="#47b07b" text-anchor="middle" font-family="Arial,sans-serif" font-size="40">وضوح أكثر · قرارات أكثر انضباطاً</text>
  <text x="690" y="385" fill="#b9c8c0" text-anchor="middle" font-family="Arial,sans-serif" font-size="25">أداة تحليلية مساعدة لمنصة TradingView</text>
</svg>`;
const ogLogo = await sharp(source).resize(330, 330).png().toBuffer();
await sharp(Buffer.from(ogSvg)).composite([{ input: ogLogo, left: 70, top: 150 }]).webp({ quality: 82 }).toFile('public/og-image-placeholder.webp');

const labels = ['مثال تاريخي — بانتظار المحتوى', 'مثال محايد — بانتظار المحتوى', 'مثال خاسر — بانتظار المحتوى'];
for (let i = 0; i < labels.length; i += 1) {
  const accent = i === 2 ? '#ef6b73' : '#47b07b';
  const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600"><rect width="960" height="600" fill="#0b0f0d"/><g stroke="#f5faf7" opacity=".08">${Array.from({ length: 10 }, (_, n) => `<path d="M0 ${60*n}H960"/>`).join('')}${Array.from({ length: 16 }, (_, n) => `<path d="M${60*n} 0V600"/>`).join('')}</g><path d="M40 430L180 360 300 390 430 220 560 300 700 170 920 230" fill="none" stroke="${accent}" stroke-width="5" opacity=".55"/><text x="480" y="530" fill="#b9c8c0" text-anchor="middle" font-family="Arial,sans-serif" font-size="28">${labels[i]}</text></svg>`;
  await sharp(Buffer.from(placeholder)).webp({ quality: 78 }).toFile(`public/screenshots/signal-example-0${i + 1}-placeholder.webp`);
}
