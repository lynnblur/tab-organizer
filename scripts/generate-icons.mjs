import sharp from "sharp";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");

// 将 SVG 渲染为指定尺寸的 PNG
async function generateIcon(size) {
  // 圆角背景的 SVG
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366F1"/>
        <stop offset="100%" style="stop-color:#8B5CF6"/>
      </linearGradient>
    </defs>

    <!-- 圆角背景 -->
    <rect width="128" height="128" rx="28" fill="url(#bg)"/>

    <!-- 标签页形状 -->
    <rect x="26" y="34" width="76" height="72" rx="8" fill="white" opacity="0.95"/>

    <!-- 标签页头部 -->
    <path d="M26 42a8 8 0 0 1 8-8h25l10 8h33a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8V42z" fill="white" opacity="0.95"/>

    <!-- 标签栏 -->
    <rect x="40" y="36" width="20" height="6" rx="3" fill="#E0E7FF"/>
    <rect x="66" y="36" width="14" height="6" rx="3" fill="#E0E7FF" opacity="0.6"/>

    <!-- 内容线条 -->
    <rect x="40" y="56" width="48" height="4" rx="2" fill="#C7D2FE"/>
    <rect x="40" y="68" width="36" height="4" rx="2" fill="#C7D2FE"/>
    <rect x="40" y="80" width="42" height="4" rx="2" fill="#C7D2FE"/>

    <!-- 对勾 ✓ -->
    <circle cx="98" cy="34" r="18" fill="#22C55E" stroke="white" stroke-width="2.5"/>
    <polyline points="90,34 95,40 106,28" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const outputPath = resolve(ROOT, "src/icons", `icon-${size}.png`);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outputPath);
  console.log(`Generated ${outputPath}`);
}

async function main() {
  await Promise.all([16, 48, 128].map(generateIcon));
  console.log("All icons generated!");
}

main().catch(console.error);
