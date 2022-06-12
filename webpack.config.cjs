const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './app/public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, "./app/public/dist")
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}