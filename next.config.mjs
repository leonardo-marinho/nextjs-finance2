/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
