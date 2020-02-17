var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: ['./scripts/app/main'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new CopyWebpackPlugin([
            {from: './img', to: 'img'},
            {from: './style', to: 'style'}
        ])
    ],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    mode: 'development', //'development', 'production'
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader?presets[]=es2015',
                        less: 'vue-style-loader!css-loader!less-loader'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?presets[]=es2015',
                exclude: /node_modules/
            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    devServer: {
        contentBase: './',
        hot: true
    }
}