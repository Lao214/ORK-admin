// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '富士康大学OKRs系统'
        return args
      })
  }
}
