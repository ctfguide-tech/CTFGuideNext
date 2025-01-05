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


};

module.exports = withPWA(removeImports(nextConfig));