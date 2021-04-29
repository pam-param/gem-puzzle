const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = (env, options) => {
  const isDevelopment = options.mode === 'development';

  const config = {
    mode: isDevelopment ? 'development' : 'production',

    entry: ['./src/index.js', './src/styles.scss'],
    output: {
      path: path.join(__dirname, './dist'),
        filename: 'script.js',
    },

    devtool: isDevelopment ? 'source-map' : false,

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 5600,
      open: {
        app: ['chrome'],
      },
    },

    module: {
      rules: [
        {
          test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
              }
            }
        },

        {
          test: /\.(mp3)$/,
          use: [
            'file-loader',
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {outputPath: 'fonts'}
            }
          ]
        },
        {
          test: /\.scss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: ''
                }
              },
              {
                loader: "css-loader"
              },
              {
                loader: "sass-loader"
              }
            ]
        },
      ]
      },

      plugins: [
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin('./src/assets/logo.jpg'),
        new HtmlWebpackPlugin( {
          template: 'index.html'
        }),
        new MiniCssExtractPlugin( {
          filename: 'style.css'
        }),

        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, './src/assets/images'),
              to: path.join(__dirname, './dist/images')
            },
          ]
        }),
        new ImageminPlugin({
          disable: isDevelopment,
          test: /\.(jpe?g|png)$/i,
          pngquant: {
            quality: '5-30'
          },
        }),
      ],
    }
    return config;
}



