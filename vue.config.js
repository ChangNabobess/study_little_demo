const webpack = require('webpack');
const path = require('path');
// const UglifyPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin"); // 开启gizp压缩
let { version, openGzip } = require('./package.json');
version = version.replace(/./g,'_');
module.exports = {
  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  assetsDir: "static",
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 别名配置
    /* config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('@a', path.resolve(__dirname, './src/assets'))
      .set('@c', path.resolve(__dirname, './src/components'))
      .set('@p', path.resolve(__dirname, './src/pages'))
      .set('jquery$', 'jquery/dist/jquery.min.js'); */
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production';

      // 将每个依赖包打包成单独的js文件
      let optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[/]node_modules[/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js  or node_modules/packageName
                const packageName = module.context.match(/[/]node_modules[/](.*?)([/]|$)/)[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              }
            }
          }
        }
      };
      Object.assign(config, {
        output:{ // 将版本号添加进打包的js名中
          ...config.output,
          filename: `static/js/[name].[chunkhash].${version}.js`,
          chunkFilename: `static/js/[name].[chunkhash].${version}.js`
        },
        optimization,
        plugins:[...config.plugins ]
      });
      if(openGzip){
        config.plugins = [
          ...config.plugins,
          new CompressionPlugin({
            test:/.js$|.html$|.css/, //匹配文件名
            threshold: 10240,//对超过10k的数据压缩
            deleteOriginalAssets: false //不删除源文件
          })
        ]
      }
    } else {
      // 为开发环境修改配置...
      config.mode = 'development';
    }
    Object.assign(config, {
      // 开发生产共同配置
      // externals: {
      //   'vue': 'Vue',
      //   'element-ui': 'ELEMENT',
      //   'vue-router': 'VueRouter',
      //   'vuex': 'Vuex'
      // } // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(用于csdn引入)
      plugins:[
        ...config.plugins,
        new webpack.ProvidePlugin({ // 使用ProvidePlugin插件为jQuery添加全局变量
          jQuery: "jquery",
          $: "jquery",
          "windows.jQuery":"jquery"
        })
      ]
    });
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // css相关配置
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    requireModuleExtension: true,
    loaderOptions: {
      css: {}, // 这里的选项会传递给 css-loader
      // postcss: {} // 这里的选项会传递给 postcss-loader
    }, // css预设器配置项
    modules: false // 启用 CSS modules for all css / pre-processor files.
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    // open: process.platform === 'darwin',
    host: '192.168.101.98', // 允许外部ip访问
    port: 8000, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    proxy: {
      '/domin-name': {
        target: 'http://192.168.101.59:8000',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          '^/domin-name': ''
        }
      }
    } // 代理转发配置，用于调试环境
  }, // 第三方插件配置
  pluginOptions: {}
};
