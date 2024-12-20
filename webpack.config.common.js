const path = require("path") 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context:path.resolve(__dirname, "src"),
    entry: "./script.js",
    output:{
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        clean:true
    },
    plugins: [
        new HtmlWebpackPlugin({
        template:path.resolve(__dirname, "public/index.html")
    }),
        new CopyPlugin({
        patterns: [{ from:path.resolve(__dirname,"public/assets") , to: "assets" }]
    }),
        new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css"
        })
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
        ],
      },
}