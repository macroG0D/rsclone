const preCssPlugin = require('precss');
const autoprefixerPlugin = require('autoprefixer');
const cssnanoPlugin = require('cssnano');

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    preCssPlugin,
    autoprefixerPlugin,
    cssnanoPlugin({
      preset: [
        'advanced', { discardComments: { removeAll: true } },
      ],
    }),
  ],
};
