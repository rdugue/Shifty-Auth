module.exports = {
  entry: './handler.js',
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      include: /node_modules\/rc\/index\.js/,
      loaders: ['shebang-loader', 'babel-loader'],
      include: __dirname
    }]
  }
};