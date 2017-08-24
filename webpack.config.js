const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  entry: './handler.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js'
  },
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