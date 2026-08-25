const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CompressionPlugin = require("compression-webpack-plugin");
const common = require("./common.js");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "theme.css",
    }),
    new WebpackPwaManifest({
      name: "Pasquale Errico",
      short_name: "ilPasPWA",
      description: "Pasquale Errico Personal Website",
      background_color: "#0a0a0a",
      theme_color: "#0a0a0a",
      crossorigin: "use-credentials", //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve("static/images/icon/icon.png"),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
        },
        {
          src: path.resolve("static/images/icon/icon.png"),
          sizes: [120, 152, 167, 180, 1024], // multiple sizes
          ios: true,
          destination: path.join("icon", "ios"),
        },
        {
          src: path.resolve("static/images/icon/large-icon.png"),
          size: "1024x1024", // you can also use the specifications pattern
        },
      ],
    }),
    new CompressionPlugin({
      filename: "[path].br[query]",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css',
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
    ],
  },
});
