// Imports
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Stylus plugins
const rupture = require('rupture')


// Default export
module.exports = {
  entry: {
    app: [
      './assets/js/main.js',
      './assets/stylus/app.styl'
    ]
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/public',
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: { }
            // other vue-loader options go here
        }
      }, 
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      stylus: {
        default: {
          use: [rupture()]
        },
        otherConfig: { /* */ }
      }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

// DEVELOPMENT ONLY
if (process.env.NODE_ENV === 'development') {

  // Use style loader to embed CSS - to enable HMR 
  module.exports.module.rules = (module.exports.module.rules || []).concat([
    {
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', 'stylus-loader']
    }
  ])
}

// PRODUCTION ONLY
if (process.env.NODE_ENV === 'production') {

  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.devtool = '#source-map'
  
  // Use the ExtractTextPlugin to extract css
  module.exports.module.rules = (module.exports.module.rules || []).concat([
      {
        test: /\.styl$/,
        use: 
          ExtractTextPlugin.extract({
            use: ['css-loader', 'stylus-loader']
          })
      }
    ])
  
  // The usual suspects
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin('css/[name].css')
  ])
}
