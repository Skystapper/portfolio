/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  basePath: '/portfolio',
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.discordapp.com'],
    unoptimized: true, // Required for static export
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