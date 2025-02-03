const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    port: 4000,
    historyApiFallback: true,
  },
  output: {
    publicPath: "http://localhost:4000/",
    filename: "main.js",
  },
});
