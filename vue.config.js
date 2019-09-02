module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/gpu-honey-gems/' : '/',
  pwa: {
    appleMobileWebAppCapable: 'yes'
  }
};
