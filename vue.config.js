module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= ''
        return args
      })
  },
  // publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/' // 设置BASE_URL的配置项
}