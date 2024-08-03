const removeImports = require("next-remove-imports")();
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
    }

    return config;
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
    esmExternals: true, // Add this to ensure esmExternals is true
  },
  ignoreDuringBuilds: true,
  transpilePackages: ['react-md-editor']
};

module.exports = withPWA(removeImports(nextConfig));