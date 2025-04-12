import withPWA from 'next-pwa';

const nextConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
})({
    // 他のNext.jsの設定
});

export default nextConfig;