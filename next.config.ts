const nextConfig = {
  output: 'export',
  trailingSlash: true, // 🔥 هذا المهم
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;