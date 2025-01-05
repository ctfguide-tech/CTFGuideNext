const removeImports = require("next-remove-imports")();
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    scrollRestoration: true,
    esmExternals: 'loose',
  },
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
        // Optionally, you can add this if you still have issues with images:
        // { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
      ],
    },
  ];
}

};

module.exports = withPWA(removeImports(nextConfig));