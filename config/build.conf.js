const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./base.conf')

const resolve = dir => path.join(__dirname, '..', dir)

module.exports = merge(baseConfig, {
  entry: {
    'vue-awesome-scroll': './src/index.js'
  },
  externals: {
    'better-scroll': {
      root: 'BScroll',
      commonjs: 'better-scroll',
      commonjs2: 'better-scroll',
      amd: 'better-scroll'
    },
    'object-assign': 'object-assign'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
    library: 'VueAwesomeScroll',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: '#source-map',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'bscroll$': 'better-scroll'
    }
  }
})