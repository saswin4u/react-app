import BrowserSynce from 'browser-sync';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import run from './run';
import runServer from './runServer';
import webPackConfig from './webpack.config';
import clean from './clean';
// import copy from './copy';

const DEBUG = !process.argv.includes('--release');

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
 async function start(){
   await run(clean);
  //  await run(copy.bind(undefined, { watch: true }));
   await new Promise(resolve => {
     // Patch the client-side bundle configurations
    // to enable Hot Module Replacement (HMR) and React Transform
    webPackConfig.filter(x => x.target !== 'node').forEach(config => {
      if(Array.isArray(config.entry)){
        config.entry.unshift('webpack-hot-middleware/client');
      }else{
        /* eslint-disable no-param-reassign */
        config.entry = ['webpack-hot-middleware/client', config.entry];
      }

      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
      config
        .module
        .loaders
        .filter(x => x.loader === 'babel-loader')
        .forEach(x => (x.query = {// eslint-disable-line no-param-reassign
          // Wraps all React components into arbitrary transforms
          // https://github.com/gaearon/babel-plugin-react-transform
          plugins: [
            ['react-transform', {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module']
                }, {
                  transform: 'react-transform-catch-errors',
                  imports: ['react']
                },
              ],
            },],
          ],
        }));
    });

    const bundler = webpack(webPackConfig);
    const wpMiddleware = webpackMiddleware(bundler, {
      // IMPORTANT: webpack middleware can't access config,
      // so we should provide publicPath by ourselves
      publicPath;; webPackConfig[0].output.publicPath,
      // Pretty colored output
      stats: webPackConfig[0].stats,
    });

    const hotMiddleware = bundler
      .compilers
      .filter(compiler => compiler.options.target !== 'node')
      .map(compiler => webpackHotMiddleware(compiler));

    let handleServerBundleComplete = () => {
      runServer((err, host) => {
        if(!err){
          const bs = BrowserSynce.create();
          bs.init({
            ...(DEBUG ? {} : { notify: false, ui: false }),
            proxy: {
              target: host,
              middleware: [wpMiddleware, ...hotMiddleware],
            },
            // no need to watch '*.js' here, webpack will take care of it for us,
            // including full page reloads if HMR won't work
            files: ['build/content/**/*.*'],
          }, resolve);
          handleServerBundleComplete = runServer;
        }
      })
    };

    bundler.plugin('done', () => handleServerBundleComplete());
  });
 }

 export default start;
