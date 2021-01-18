const webpack = require('webpack');
const merge = require('webpack-merge');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    watchContentBase: true,
    writeToDisk: true,
    open: true,
    port: 3000,
    hot: true,
    overlay: {
      warnings: true,
      errors: true,
    },
  },

  plugins: [
    new ErrorOverlayPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
