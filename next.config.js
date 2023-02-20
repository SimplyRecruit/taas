/* eslint-disable @typescript-eslint/no-var-requires */
const { i18n } = require('./next-i18next.config')
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { dirs: ['src', 'models', 'server'] },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  i18n,
}

module.exports = nextConfig
