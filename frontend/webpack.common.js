const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const childProcess = require('child_process');

const commitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
const buildDate = new Date().toISOString();

module.exports = () => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[name].[contenthash][ext][query]'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new DefinePlugin({
        __BUILD_VERSION__: JSON.stringify(require('./package.json').version),
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __BUILD_DATE__: JSON.stringify(buildDate),
      }),
    ],
  };
};
