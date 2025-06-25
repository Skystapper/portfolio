/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export settings for development
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.discordapp.com'],
    // Remove unoptimized for development
  },
  // Configure for tunnel access
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Add GSAP plugin configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/'
        }
      }
    });
    return config;
  }
};

module.exports = nextConfig; 