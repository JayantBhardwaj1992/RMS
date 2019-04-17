'use strict'

/**
 * Webpack Config
 */
const path = require('path')
const fs = require('fs')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/'

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// plugins
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')

// the path(s) that should be cleaned
let pathsToClean = [
    'dist',
    'build'
]

// the clean options to use
let cleanOptions = {
    root: __dirname,
    verbose: false, // Write logs to console.
    dry: false
}

module.exports = {
    entry: ['babel-polyfill', 'react-hot-loader/patch', './client/src/index.js'],
    output: {
        // The build folder.
        path: resolveApp('dist'),
        // Generated JS file names (with nested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'assets/js/[name].[hash:8].js',
        chunkFilename: 'assets/js/[name].[hash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: publicPath,
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
    },
    devServer: {
        contentBase: './client/src/index.js',
        compress: true,
        host:'192.168.7.71',
        port: 3001, // port number,
        proxy: {
            '/api/*': {
                'target': 'http://192.168.7.71:3000'
            }
        },
        historyApiFallback: true,
        quiet: true,
      
    },
    // resolve alias (Absolute paths)
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'client/src/components/'),
            Containers: path.resolve(__dirname, 'client/src/containers/'),
            Assets: path.resolve(__dirname, 'client/src/assets/'),
            Util: path.resolve(__dirname, 'client/src/util/'),
            Routes: path.resolve(__dirname, 'client/src/routes/'),
            Constants: path.resolve(__dirname, 'client/src/constants/'),
            Redux: path.resolve(__dirname, 'client/src/redux/'),
            Data: path.resolve(__dirname, 'client/src/data/')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
           
            // Scss compiler
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader'
                        
                    }
                ]
            }
           
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                },
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'client/src/assets/img', to: 'assets/img'}, {from: 'client/src/assets/fonts', to: 'assets/fonts'}
        ]),
        new FriendlyErrorsWebpackPlugin(),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new HtmlWebPackPlugin({
            template: './public/index.html',
            filename: './index.html',
            favicon: './public/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[hash:8].css'
        })
    ]
}
