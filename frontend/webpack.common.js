const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildDate = new Date().toISOString();

module.exports = () => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
      publicPath: '/',
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public/favicon',
            to: 'favicon',
          },
          {
            from: 'public/images',
            to: 'images',
          },
        ],
      }),
      new DefinePlugin({
        __BUILD_VERSION__: JSON.stringify(require('./package.json').version),
        __BUILD_DATE__: JSON.stringify(buildDate),
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              png: {
                quality: 80,
              },
            },
          },
        },
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    },
  };
};
