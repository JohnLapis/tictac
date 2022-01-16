const { VueLoaderPlugin } = require("vue-loader");
const path = require('path')

module.exports = {
  entry: path.resolve('./resources/js/main.js'),
  output: {
    path: path.resolve('./public/js'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader",
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
}
