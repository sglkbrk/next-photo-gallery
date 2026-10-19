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
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
}

export async function compressAndWatermark(buffer: Buffer): Promise<Buffer> {
  const resized = sharp(buffer).rotate().resize({
    width: TARGET_WIDTH,
    height: undefined,
    fit: 'inside',
    withoutEnlargement: true
  });

  const { data, info } = await resized.png().toBuffer({ resolveWithObject: true });
  const width = info.width || TARGET_WIDTH;
  const height = info.height || 1080;

  const textElements = Array.from({ length: 9 }, () => {
    const x = Math.floor(Math.random() * Math.max(1, width - 100));
    const y = Math.floor(Math.random() * Math.max(1, height - 30));
    return `<text x="${x}" y="${y + 20}" font-family="Arial, sans-serif" font-size="20" fill="gray" opacity="0.7">Bsgallery</text>`;
  }).join('');

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${textElements}</svg>`;

  return sharp(data)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toBuffer();
}

export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0
  };
}
