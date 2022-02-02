// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const devServerPort = 3002;

const publicPath =
  process.env.NODE_ENV === "production"
    ? "https://cdn.diamond2221.com/build/eye-remind"
    : "/";

module.exports = {
  publicPath: "/",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    hot: true, // 热加载
    liveReload: true, // 热加载
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    progress: false,
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://localhost:${mockServerPort}/mock-api/v1`,
        target: process.env.VUE_APP_FULL_API,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
  pluginOptions: {
    // 'style-resources-loader': {
    // preProcessor: 'less',
    // patterns: [
    // path.resolve(__dirname, 'src/styles/_variables.less'),
    // path.resolve(__dirname, 'src/styles/_mixins.less'),
    // path.resolve(__dirname, 'src/styles/detail_page.less'),
    // path.resolve(__dirname, 'src/styles/list_page.less')
    // ],
    // javascriptEnabled: true
    // }
  },
  chainWebpack(config) {
    // config.set('name', name)

    // 修改文件引入自定义路径
    config.resolve.alias
      .set("src", resolve("src"))
      .set("assets", resolve("src/assets/"))
      .set("utils", resolve("src/utils/"))
      .set("types", resolve("src/types/"))
      .set("api", resolve("src/api/"))
      .set("views", resolve("src/views/"))
      .set("components", resolve("src/components/"));

    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          // viewDesign: {
          //   name: 'chunk-viewDesign',
          //   priority: 11,
          //   test: /[\\/]node_modules[\\/]_?dm-view-design(.*)/
          // },
          commons: {
            name: "chunk-commons",
            test: path.resolve(__dirname, "src/components"),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
    if (process.env.use_analyzer) {
      // 分析
      config
        .plugin("webpack-bundle-analyzer")
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  },
  css: {
    // loaderOptions: {
    //   less: {
    //     lessOptions: {
    //       javascriptEnabled: true
    //     }
    //   }
    // }
  },
};
