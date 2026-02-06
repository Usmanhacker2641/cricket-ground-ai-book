/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable image optimization for external domains
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
                pathname: '/**',
            },
        ],
    },
    // Suppress hydration warnings in development
    reactStrictMode: true,
};

module.exports = nextConfig;
