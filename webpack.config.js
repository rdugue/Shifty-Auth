module.exports = {
  entry: './handler.js',
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['shebang-loader', 'babel-loader'],
      include: __dirname
    }]
  }
};