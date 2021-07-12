const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./index.ts",

  output: {
    globalObject: "this",
    path: path.resolve(__dirname, "dist/bundle"),
    filename: "testweave.js", 
    library: "testweave"
  },

  resolve: {
    extensions: [".js", ".ts"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: "ts-loader",
        exclude: [
          /node_modules/,
          /test/
        ]
      }
    ]
  },

  plugins: [
		new NodePolyfillPlugin()
	]
};
