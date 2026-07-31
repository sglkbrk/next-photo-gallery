const config = {
  imageUrl: '/api/files/',
  apiEndpoints: {
    downloadFile: '/api/files/',
    imageUrl: '/api/files/'
  }
};

export default config;

export function getImageUrl(fileKey: string | null | undefined): string {
  if (!fileKey) {
    return '/screenshot.png';
  }
  return `${config.imageUrl}${fileKey}`;
}
