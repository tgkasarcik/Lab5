const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    devtool: 'eval-source-map',
    devServer: {
        open: ' ',
        static: './dist'
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // regex to match files with the .ts extension
                loader: 'ts-loader'
            },
            {
                test: /\.glsl$/, // regex to match files with the .glsl extension
                loader: 'webpack-glsl-loader'
            },
            {
                test: /\.png$/,
                type: 'asset/resource'
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "CSE 5542 Lab 5", // Replace this with the name of your app
            filename: "index.html",
            template: "src/index.html"
        })
    ],
};