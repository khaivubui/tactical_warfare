const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './frontend/tactical_warfare.js',
  output: {
      path: path.resolve(__dirname, 'public'),
      filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.js$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  }//,
  // plugins:[
  //   new webpack.DefinePlugin({
  //     'process.env':{
  //       'NODE_ENV': JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress:{
  //       warnings: true,
  //       drop_debugger: false
  //     },sourceMap: true
  //   })
  // ]
};
