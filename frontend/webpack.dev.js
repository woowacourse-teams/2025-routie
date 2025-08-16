const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common(), {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
      },
      {
        directory: path.resolve(__dirname, 'public'),
      },
    ],
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({
      path: './.env.dev',
      systemvars: true,
    }),
  ],
});
