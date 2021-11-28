// 参考文档：https://www.jianshu.com/p/b358a91bdf2d
const webpack = require('webpack');
const path = require('path');
// const UglifyPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin"); // 开启gizp压缩
const HtmlWebpackPlugin = require('html-webpack-plugin')
let { version, openGzip } = require('./package.json');
version = version.replace(/./g,'_');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/', // 部署应用包时候的基础路径 == output.publicPath
  outputDir: 'dist', // 输出文件目录
  assetsDir: "static", // 静态资源路径
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径 == outputDir
  filenameHashing: true,// 文件名hash
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  runtimeCompiler: false, // 是否使用带有浏览器内编译器的完整构建版本
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  crossorigin: '', // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性。
  integrity: false, // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)。如果你构建后的文件是部署在 CDN 上的，启用该选项可以提供额外的安全性
  /* pages: {//用于多页配置，默认是 undefined
    index: {
      // page 的入口文件
      entry: 'src/main.js',
      // 模板文件
      template: 'public/index.html',
      // 在 dist/index.html 的输出文件
      filename: 'index.html',
      // 当使用页面 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板文件默认是 `public/subpage.html`
    // 如果不存在，就回退到 `public/index.html`。
    subpage: 'src/subpage/main.js'
  }, */
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: (config) => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 别名配置
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src')) // _dirname 是nodejs的变量，代表当前文件夹目录下的绝对路径
      .set('@a', path.resolve(__dirname, './src/assets'))
      .set('@c', path.resolve(__dirname, './src/components'))
      .set('@p', path.resolve(__dirname, './src/pages'))
      .set('jquery$', 'jquery/dist/jquery.min.js');
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
      /* config.plugins.forEach((val) => {
        console.log(val);
        VueLoaderPlugin {}
        DefinePlugin {
          definitions:
          { 'process.env': { NODE_ENV: '"development"', BASE_URL: '"/"' } } }
        CaseSensitivePathsPlugin {
          options: {},
          logger:
          Console {
            log: [Function: bound consoleCall],
            debug: [Function: bound consoleCall],
            info: [Function: bound consoleCall],
            dirxml: [Function: bound consoleCall],
            warn: [Function: bound consoleCall],
            error: [Function: bound consoleCall],
            dir: [Function: bound consoleCall],
            time: [Function: bound consoleCall],
            timeEnd: [Function: bound consoleCall],
            timeLog: [Function: bound timeLog],
            trace: [Function: bound consoleCall],
            assert: [Function: bound consoleCall],
            clear: [Function: bound consoleCall],
            count: [Function: bound consoleCall],
            countReset: [Function: bound consoleCall],
            group: [Function: bound consoleCall],
            groupCollapsed: [Function: bound consoleCall],
            groupEnd: [Function: bound consoleCall],
            table: [Function: bound consoleCall],
            Console: [Function: Console],
            markTimeline: [Function: markTimeline],
            profile: [Function: profile],
            profileEnd: [Function: profileEnd],
            timeline: [Function: timeline],
            timelineEnd: [Function: timelineEnd],
            timeStamp: [Function: timeStamp],
            context: [Function: context],
            [Symbol(counts)]: Map {},
            [Symbol(kColorMode)]: 'auto' },
          pathCache: {},
          fsOperations: 0,
          primed: false }
        FriendlyErrorsWebpackPlugin {
          compilationSuccessInfo: {},
          onErrors: undefined,
          shouldClearConsole: true,
          formatters:
          [ [Function: format],
            [Function: format],
            [Function: format],
            [Function] ],
          transformers:
          [ [Function: transform],
            [Function: transform],
            [Function: transform],
            [Function] ],
          previousEndTimes: {} }
        MiniCssExtractPlugin {
          options:
          { filename: 'static/css/[name].[contenthash:8].css',
            moduleFilename: [Function: moduleFilename],
            ignoreOrder: false,
            chunkFilename: 'static/css/[name].[contenthash:8].css' } }
        HtmlWebpackPlugin {
          options:
          { template: 'D:\\Work\\study-little-demo\\public\\index.html',
            templateParameters: [Function: templateParameters],
            filename: 'index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',
            excludeChunks: [],
            chunksSortMode: 'auto',
            meta: {},
            title: 'ceshiyixia',
            xhtml: false } }
        PreloadPlugin {
          options:
          { rel: 'preload',
            include: 'initial',
            excludeHtmlNames: [],
            fileBlacklist: [ /\.map$/, /hot-update\.js$/ ] } }
        PreloadPlugin {
          options:
          { rel: 'prefetch',
            include: 'asyncChunks',
            excludeHtmlNames: [],
            fileBlacklist: [ /\.map/ ] } }
        CorsPlugin { crossorigin: '', integrity: false, publicPath: '/' }
        CopyPlugin {
          patterns:
          [ { from: 'D:\\Work\\study-little-demo\\public',
              to: 'D:\\Work\\study-little-demo\\dist',
              toType: 'dir',
              ignore: [Array] } ],
          options: {} }
        HotModuleReplacementPlugin {
          options: {},
          multiStep: undefined,
          fullBuildTimeout: 200,
          requestTimeout: 10000 }
        ProgressPlugin {
          profile: false,
          handler: undefined,
          modulesCount: 500,
          showEntries: false,
          showModules: true,
          showActiveModules: true }
        if (val instanceof HtmlWebpackPlugin) {
            console.log(val)
            console.log(val.options.templateParameters.toString())
        }
       }) */
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
          "windows.jQuery":"jquery",
          UTILS: path.resolve(path.join(__dirname, './src/utils/validator.js'))
        }),
      ]
    });
  },
  // css相关配置
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
    sourceMap: false, // 开启 CSS source maps?
    requireModuleExtension: true, // 启用 CSS modules for all css / pre-processor files.
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      css: {// 这里的选项会传递给 css-loader
        /* sass: {
          // 全局引入公共样式
          data: `@import "@src/css/base.scss";`
         } */
      }, 
      // postcss: {} // 这里的选项会传递给 postcss-loader
    },
    // modules: false  // v4及以上已弃用
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader(多进程打包)。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    open: process.env.NODE_ENV == 'production' ? false : true,
    host: '192.168.101.101', // 允许外部ip访问
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
      },
      '/list' :{
        target: 'https://apis.map.qq.com/ws/district',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          '^/list': '/list'
        }
      }
    } // 代理转发配置，用于调试环境
  }, // 第三方插件配置
  pluginOptions: {}
};
