/* eslint no-console: 0 */
const $ = require('gulp-load-plugins')();
const WebpackDevServer = require('webpack-dev-server');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const nodemon = require('nodemon');
const path = require('path');
const webpack = require('webpack');

const appConfig = require('./config/variables');
const webPackConfig = require('./config/webpack.config');

/**
 * The default task. Runs a development server source maps, etc.
 */
gulp.task('default', ['serve:development']);

gulp.task('serve:development', () => {
  new WebpackDevServer(webpack(webPackConfig.devConfig(), (err, stats) => {
    if(err){
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[serve:development]', stats.toString({ colors: true }))
  }), {
    proxy: {

    },
    publicPath: appConfig.webpack.webAssetPath,
    noInfo: true,
    historyApiFallback: true,
    stats: { color: true },
    hot: true
  })
    .listen(appConfig.webpack.port, '0.0.0.0', (error) => {
      if(error){
        throw new gutil.PluginError('serve:development', error);
      }
      gutil.log('[serve.development]', `http://localhost:${appConfig.webpack.port}/webpack-dev-server/index.html`)
    });
});

gulp.task('lint:js', () =>
  gulp.src(['**/*.js', '**/*.jsx', '!node_modules/**', '!public/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('lint', ['lint:js'])
