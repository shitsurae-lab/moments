import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL || 'http://nginx:80'; // rewritesのdestination用（サーバーサイド）
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // CSP用（ブラウザ）

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`, // backendUrl
      },
      {
        source: '/sanctum/:path*',
        destination: `${backendUrl}/sanctum/:path*`, // backendUrl
      },
      {
        source: '/auth/login',
        destination: `${backendUrl}/login`, // backendUrl
      },
      {
        source: '/auth/logout',
        destination: `${backendUrl}/logout`, // backendUrl
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              //全てのリソースは同じドメインからのみ読み込める。他の設定で上書きされる。
              "default-src 'self'",
              // Next.jsの動作に必要なインラインスクリプトを許可（Next.jsは内部でインラインスクリプトを使うため unsafe-inline と unsafe-eval が必要です）
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Tailwindのインラインスタイルを許可
              "style-src 'self' 'unsafe-inline'",
              // 画像の許可ドメイン
              "img-src 'self' blob: data: https://images.unsplash.com https://pub-a8395051699348cd862cbff28dac1add.r2.dev",
              // APIリクエストの許可先
              `connect-src 'self' ${apiUrl} http://localhost:8000 http://localhost:3080 https://api.unsplash.com`,
              // フォントの許可
              "font-src 'self'",
              // このサイトにiframeを埋め込めなくされています
              "frame-ancestors 'none'",
            ].join('; '),
          },
          // クリックジャッキング対策
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // MIMEタイプのスニッフィング対策
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // リファラー情報の制限
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-a8395051699348cd862cbff28dac1add.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
