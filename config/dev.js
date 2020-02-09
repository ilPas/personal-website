const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const common = require("./common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    host: "0.0.0.0"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "theme.css"
    }),
    new WebpackPwaManifest({
      name: "Pasquale Errico PWA",
      short_name: "MyPWA",
      description: "Pasquale Errico Progressive Web App!",
      background_color: "#0a0a0a",
      crossorigin: "use-credentials", //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve("static/images/icon/icon.png"),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        },
        {
          src: path.resolve("static/images/icon/large-icon.png"),
          size: "1024x1024" // you can also use the specifications pattern
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/dist/css/"
            }
          },

          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  }
});
