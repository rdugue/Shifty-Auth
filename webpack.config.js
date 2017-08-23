module.exports = {
  entry: './handler.js',
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['shebang-loader', 'babel-loader'],
      include: __dirname
    }]
  }
};