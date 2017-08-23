var nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['rc']
  })],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['shebang-loader', 'babel-loader'],
      include: __dirname
    }]
  }
};