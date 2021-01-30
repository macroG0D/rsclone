const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  dist: path.resolve(__dirname, '../dist'),
  assets: 'assets',
  static: 'static',
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: [`${PATHS.src}/index.js`],
  output: {
    filename: './js/[name].js',
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },

  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.(woff|woff2|ttf|otf|eot)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/fonts',
        name: '[name].[ext]',
        publicPath: './assets/fonts',
      },
    }, {
      test: /\.(ico|png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/images',
        name: '[name].[ext]',
        publicPath: './assets/images',
      },
    }, {
      test: /\.(wav|mp3|midi)$/,
      loader: 'file-loader',
      options: {
        outputPath: 'assets/sounds',
        name: '[name].[ext]',
        publicPath: './assets/sounds',
      },
    }, {
      test: /\.(scss|css)$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { sourceMap: true, importLoaders: 2 } },
        { loader: 'postcss-loader', options: { sourceMap: true, config: { path: './postcss.config.js' } } },
        { loader: 'sass-loader', options: { sourceMap: true } },
      ],
    }],
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      inject: true,
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      favicon: `${PATHS.src}/${PATHS.assets}/icons/favicon.ico`,
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/${PATHS.static}`,
        to: `${PATHS.static}`,
        noErrorOnMissing: true,
      },
    ]),
  ],
};
