const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CompressionPlugin = require('compression-webpack-plugin');

const OfflinePlugin = require('offline-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        sourceMap: true,
      })
    ]
  },
  plugins: [
    // Copy netlify redirects to newly created 'dist' dir
    new CopyWebpackPlugin([
      {from: './src/seo/_headers', to: './'},
      {from: './src/seo/robots.txt', to: './'},
      // {from: './src/seo/sitemap.xml', to: './'},
    ]),
    // Copy all assets to newly created 'dist' dir
    new CopyWebpackPlugin([
        {from:'./assets', to:'assets'}
    ]),
    // only compressed html/css/js, skips compressing sourcemaps etc
    new CompressionPlugin({
      test: /\.(html|css|js)(\?.*)?$/i
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      gifsicle: { // lossless gif compressor
        optimizationLevel: 9
      },
      pngquant: ({ // lossy png compressor, remove for default lossless
        quality: '75'
      }),
      plugins: [imageminMozjpeg({ // lossy jpg compressor, remove for default lossless
        quality: '75'
      })]
    }),
    new OfflinePlugin()
  ]
});