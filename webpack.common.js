/**
 * Webpack
 * Common
 */

const path = require('path')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const Md5HashPlugin = require('webpack-md5-hash')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',
        vendor: [
            '@uirouter/angularjs',
            'angular'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            // Html
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    conservativeCollapse: false
                }
            },
            // Svg
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
                options: {
                    removeTags: true,
                    // Don't remove width / hight attributes
                    removeSVGTagAttrs: false
                }
            },
            // Babel
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory',
                options: {
                    presets: [
                        // Skip module transpilation (Done by webpack)
                        ['env', {
                            modules: false,
                            targets: {
                                browsers: 'last 2 versions'
                            }
                        }]
                    ],
                    plugins: ['angularjs-annotate']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'manifest'],
            minChunks: Infinity
        }),
        new Md5HashPlugin(),
        new ChunkManifestPlugin(),
        new HtmlPlugin({
            template: 'src/index.html'
        }),
    ],
    stats: {
        assetsSort: "name",
        modules: false
    }
}
