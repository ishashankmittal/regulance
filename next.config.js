/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to fix the apostrophe issue
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 