module.exports = {
  entry: './handler.js',
  target: 'node',
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader', 'shebang'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  }
};