var PROD = process.argv.indexOf("-p") >= 0;
var webpack = require("webpack");

module.exports = {
    entry: {
        planning: __dirname + "/index.js"
    },
    output: {
        libraryTarget: "umd",
        library: ["planning"],
        path: __dirname + "/dist",
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     beautify: false,
        //     comments: false,
        //     compress: {
        //         warnings: false,
        //         drop_console: true,
        //         collapse_vars: true,
        //         reduce_vars: true,
        //     }
        // })
    ]
};