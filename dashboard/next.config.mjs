/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    // Avoid Windows rename() warnings from webpack persistent cache during dev
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;


