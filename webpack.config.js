module.exports = {
  entry: './handler.js',
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader', 'shebang-loader'],
      include: __dirname
    }]
  }
};