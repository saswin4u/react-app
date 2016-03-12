import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';

import appConfig from './variables';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
CONST AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? "development" : "production",
  __DEV__: DEBUG
}

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const config = {
  output: {
    publicPath: appConfig.paths.buildDir,
    sourcePrefix: '  ',
  },
  cache: DEBUG,
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  plugins:[
    new webpack.optimize.OccurenceOrderPlugin(),
  ],
  resolve:{
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },
  module:{
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query:{
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------
const clientConfig = extend(true, {}, config, {
  entry: appConfig.paths.buildEntryFileName,
  output: {
    filename: DEBUG ? '[name].js[hash]' : '[name].[hash].js',
    path: path.join(appConfig.paths.buildDir, '/public')
  },
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    ...config.plugins,
    new webpack.DefinePlugins({ ...GLOBALS, 'process.env.BROWSER' : true }),
    new AssetsPlugin({
      path: appConfig.paths.buildDir,
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)}`,
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyPlugin({
        compress:{
          screw_ie8: true,
          warning: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]: []),
  ],
});

export default [clientConfig];
