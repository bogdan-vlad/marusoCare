const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
// const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [{
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            publicPath: 'images/'
          },
        }]
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
            publicPath: 'fonts/'
          },
        }]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.hbs$/,
        use: {
          loader: 'handlebars-loader',
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Home',
      filename: 'index.html',
      template: 'src/templates/index.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: '404',
      filename: '404.html',
      template: 'src/templates/404.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: 'Received',
      filename: 'received.html',
      template: 'src/templates/received.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: 'Terms & Conditions',
      filename: 'terms_and_conditions.html',
      template: 'src/templates/terms.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: 'Privacy Policy',
      filename: 'privacy_policy.html',
      template: 'src/templates/privacy.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: 'Register',
      filename: 'register.html',
      template: 'src/templates/register.hbs',
      inject: 'head'
    }),
    new HtmlWebpackPlugin({
      title: 'Register Received',
      filename: 'register_received.html',
      template: 'src/templates/register_received.hbs',
      inject: 'head'
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.(woff|woff2|ttf|otf)$/.test(entry)) return 'font';
      },
      fileWhitelist: [/\.(woff|woff2|ttf|otf)$/],
      include: 'allAssets'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new MiniCssExtractPlugin({
      filename: 'webpack-bundle.css',
      chunkFilename: '[id].css'
    }),
    // new HtmlWebpackInlineSVGPlugin()
  ],
  output: {
    filename: 'webpack-bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

