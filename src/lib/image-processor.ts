import sharp from 'sharp';

const TARGET_WIDTH = 1920;
const JPEG_QUALITY = 75;

export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: TARGET_WIDTH,
      height: undefined,
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
}

export async function compressAndWatermark(buffer: Buffer): Promise<Buffer> {
  const compressed = await compressImage(buffer);
  const metadata = await sharp(compressed).metadata();
  const width = metadata.width ?? TARGET_WIDTH;
  const height = metadata.height ?? 1080;

  const textElements = Array.from({ length: 9 }, () => {
    const x = Math.floor(Math.random() * Math.max(1, width - 100));
    const y = Math.floor(Math.random() * Math.max(1, height - 30));
    return `<text x="${x}" y="${y + 20}" font-family="Arial, sans-serif" font-size="20" fill="gray" opacity="0.7">Bsgallery</text>`;
  }).join('');

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

  return sharp(compressed)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
}

export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0
  };
}
