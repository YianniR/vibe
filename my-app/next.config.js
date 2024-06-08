const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: isProd ? './' : '',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/home': { page: '/home' },
      '/edit': { page: '/edit' },
      '/settings': { page: '/settings' }
    };
  },
};
