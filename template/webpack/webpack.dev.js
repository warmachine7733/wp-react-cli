const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: 4000,
    server: 'http',
    static: {
      directory: './public',
    }
  },
  output: {
    publicPath: "/",
    filename: "main.js",
  },
});
