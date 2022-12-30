/* eslint-disable */
const { WebpackPnpExternals } = require('webpack-pnp-externals');

const path = require('path');

console.log('Now is in the webpack-build.config!');
module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [WebpackPnpExternals({ exclude: ['a'] })],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
    ],
    target: 'node',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'main.js',
    },
  };
};
