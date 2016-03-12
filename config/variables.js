const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../');

const BUILD_DIRNAME = 'build';
const SOURCE_DIR = path.join(ROOT_PATH, 'app');
const BUILD_DIR = path.join(ROOT_PATH, BUILD_DIRNAME);

const ENTRY_FILENAME = 'app.js';
const OUTPUT_FILENAME = 'bundle.js';

/**
* Host and port for webpack-dev-server runs
**/
const SERVER_HOST = '0.0.0.0';
const SERVER_PORT = process.env.PORT || 5000;

module.exports = {
  publicPaths: {
    build: `${BUILD_DIRNAME}`
  },
  server: {
    port: SERVER_PORT,
    host: SERVER_HOST
  },
  paths: {
    root: ROOT_PATH,
    firebaseLink: 'https://app-note-taker.firebaseio.com/',
    gitHubApi: 'https://api.github.com/users/',
    source: SOURCE_DIR,
    buildDir: BUILD_DIR,
    buildEntryFileName: path.join(SOURCE_DIR, ENTRY_FILENAME),
    buildDevFileName: path.join(BUILD_DIR, OUTPUT_FILENAME),
    config: path.join(ROOT_PATH, 'config')
  },
  webpack: {
    entry: path.join(SOURCE_DIR, 'App'),
    webAssetPath: path.join(ROOT_PATH, BUILD_DIRNAME),
    outFile: 'bundle.js',
    port: SERVER_PORT,
    host: SERVER_HOST
  }
};
