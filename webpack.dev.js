/**
 * Webpack
 * Development
 */

const webpack = require('webpack')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const port = process.env.port || 8080

module.exports = {
    output: {
        filename: '[name].js'
    },
    devtool: 'eval-source-map',
    devServer: {
        port: port,
        historyApiFallback: true,
        compress: true,
        hot: true,
        overlay: true,
        stats: 'errors-only',
        clientLogLevel: 'none'
    },
    module: {
        rules: [
            // Sass
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({
            url: `http://localhost:${port}`,
            browser: 'Google Chrome'
        })
    ]
}
