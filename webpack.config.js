module.exports = {
  entry: './app/App.js',
  output: {
    filename: 'public/bundle.js'
  },
  stats: {
      // Configure the console output
      colors: true,
      modules: true,
      reasons: true
  },
  progress: true,
  keepalive: true,
  module:{
    loaders:[
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
}
