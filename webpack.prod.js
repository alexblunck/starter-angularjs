/**
 * Webpack
 * Production
 */

const pkg = require('./package.json')
const git = require('git-repo-info')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')

const sha = git().sha.substr(0, 7)

module.exports = {
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    devtool: 'hidden-source-map',
    module: {
        rules: [
            // Sass
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'postcss-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ]
                })
            }
        ]
    },
    plugins: [
        new CleanPlugin(['dist'], {
            verbose: false
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css'
        }),
        new CompressionPlugin({
            test: /\.(js|css)$/
        }),
        new ZipPlugin({
            filename: `${pkg.name}-${sha}.zip`
        })
    ]
}
