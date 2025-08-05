/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr']
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/docs/index.html'
      },
      {
        source: '/thesis/:path*',
        destination: '/docs/:path*'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/docs/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
