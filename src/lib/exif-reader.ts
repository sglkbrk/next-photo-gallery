import exifr from 'exifr';

export interface ExifData {
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  iso: string | null;
  shutterSpeed: string | null;
  date: string | null;
}

export async function readExifData(buffer: Buffer): Promise<ExifData> {
  try {
    const exif = await exifr.parse(buffer, {
      pick: [
        'Model',
        'LensModel',
        'FocalLength',
        'FNumber',
        'ISO',
        'ExposureTime',
        'DateTimeOriginal',
        'CreateDate'
      ]
    });

    if (!exif) {
      return emptyExif();
    }

    return {
      camera: exif.Model ? String(exif.Model) : null,
      lens: exif.LensModel ? String(exif.LensModel) : null,
      focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : null,
      aperture: exif.FNumber ? `f/${exif.FNumber}` : null,
      iso: exif.ISO ? String(exif.ISO) : null,
      shutterSpeed: exif.ExposureTime ? formatShutterSpeed(exif.ExposureTime) : null,
      date: exif.DateTimeOriginal
        ? String(exif.DateTimeOriginal)
        : exif.CreateDate
          ? String(exif.CreateDate)
          : null
    };
  } catch {
    return emptyExif();
  }
}

function formatShutterSpeed(exposureTime: number): string {
  if (exposureTime >= 1) {
    return `${exposureTime}s`;
  }
  return `1/${Math.round(1 / exposureTime)}`;
}

function emptyExif(): ExifData {
  return {
    camera: null,
    lens: null,
    focalLength: null,
    aperture: null,
    iso: null,
    shutterSpeed: null,
    date: null
  };
}
