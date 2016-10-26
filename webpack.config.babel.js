import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import validate from 'webpack2-validator'
import { dependencies } from './package.json'

let babelConfig = JSON.parse(fs.readFileSync('./.babelrc'))

/* turn off modules in es2015 preset to enable tree-shaking
   (this is on in babelrc because setting it otherwise causes issues with
   this config file) */
babelConfig.presets = babelConfig.presets.map(
  (preset) => preset === 'es2015' ? ['es2015', { modules: false }] : preset
)

const babelOpts = {
  ...babelConfig,
  babelrc: false,
  cacheDirectory: 'babel_cache'
}

const SHARED_CONFIG = {
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: 'node_modules',
      query: babelOpts
    }]
  },
  resolve: {
    modules: [
      path.join(__dirname, './src'),
      'node_modules'
    ]
  }
}

const SERVER_CONFIG = validate({
  ...SHARED_CONFIG,
  target: 'node',
  entry: {
    server: './src/server.js',
    renderer: './src/renderer.js'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[id].server.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      BROWSER_BUILD: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ],
  externals: Object.keys(dependencies)
})

const CLIENT_CONFIG = validate({
  ...SHARED_CONFIG,
  entry: {
    app: './src/client.js',
    vendor: ['vue']
  },
  output: {
    path: path.join(__dirname, './dist/assets'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      BROWSER_BUILD: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ]
})

export default [SERVER_CONFIG, CLIENT_CONFIG]
