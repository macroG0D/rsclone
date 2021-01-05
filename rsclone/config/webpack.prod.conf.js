const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [{
      test: /\.?scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: false, importLoaders: 2 },
        }, {
          loader: 'sass-loader',
          options: { sourceMap: false },
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: false, config: { path: './postcss.config.js' } },
        },
      ],
    }],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${baseWebpackConfig.externals.paths.assets}/[name].[hash].css`,
    }),
  ],
});
