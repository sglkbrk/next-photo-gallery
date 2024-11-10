const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  apiEndpoints: {
    downloadFile: process.env.NEXT_PUBLIC_IMAGE_URL + '/api/MinioFile/download/'
  }
};

export default config;
