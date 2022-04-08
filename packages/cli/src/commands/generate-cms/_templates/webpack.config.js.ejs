const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const fs = require("fs-extra");
const chokidar = require("chokidar");

/**
 * Path to the export
 */
const exportDir = path.join(__dirname, "public", "bundle");
const PORT = 3000;

const prepareUrlString = (url, isDev) => `${isDev ? "bundle/" : ""}${url}`

module.exports = (env, args) => {
  // Save the info about environment we are in
  const ENV = env?.production ? "production" : "development";
  // Determine if this is the production build
  const PROD = ENV !== "development";

  // Remove old version
  fs.removeSync(exportDir);
  // Create the dir after its deletion
  fs.ensureDirSync(exportDir);

  /** @typeof import('webpack').Configuration */
  return {
    entry: {
      root: {
        import: "./frontend-src/index.ts",
        filename: prepareUrlString("index.js", !PROD),
      },
    },

    output: {
      path: exportDir,
      filename: "[name].js",
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: prepareUrlString("[name].css", !PROD),
        chunkFilename: prepareUrlString("[id].chunk.css", !PROD),
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: "[file].map",
      }),
      new CompressionPlugin(),
    ],

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
      modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
          use: [{ loader: "url-loader?limit=100000" }],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.json$/,
          use: "json-loader",
        },
        {
          test: /\.(xml|html|txt|md)$/,
          use: "raw-loader",
        },
        {
          test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
          use: ENV === "production" ? "file-loader" : "url-loader",
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },

    stats: { colors: true },

    node: {
      global: true,
      __filename: false,
      __dirname: false,
    },

    mode: ENV,

    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
    },

    devtool: PROD ? "source-map" : "eval-source-map",

    devServer: {
      host: "localhost",
      proxy: {
        "*": {
          target: `http://localhost`,
        },
      },
      port: PORT,
      onBeforeSetupMiddleware(server) {
        const files = [
          "app/**/*",
          "locales/**/*",
          "modules/**/*",
          "templates/**/*",
        ];

        chokidar
          .watch(files, {
            alwaysStat: true,
            atomic: false,
            followSymlinks: false,
            ignoreInitial: true,
            ignorePermissionErrors: true,
            persistent: true,
            usePolling: true,
          })
          .on("all", () => {
            for (const ws of server.webSocketServer.clients) {
              ws.send('{"type": "static-changed"}');
            }
          });
      },
    },
  };
};
