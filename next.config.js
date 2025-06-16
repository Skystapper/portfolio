/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.discordapp.com'],
    unoptimized: true, // Required for static export
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