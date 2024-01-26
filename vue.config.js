const marked = require('marked')
const renderer = new marked.Renderer()

const exportsConfig = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}
exportsConfig.lintOnSave = 'warning'
// if (process.env.NODE_ENV === 'development') {
// exportsConfig.devServer = {
//   port: 80, // 端口号
//   // host: '10.221.101.38', // 本地开发域名
//   proxy: 'http://localhost:4000', // 配置跨域处理,只有一个代理
//   disableHostCheck: true,
//   compress: true,
//   proxy: {
//     '/api/file': {
//       target: process.env.VUE_FILE_API,
//       secure: true,
//       changeOrigin: true
//     },
//     '/api': {
//       target: process.env.VUE_APP_API,
//       secure: true,
//       changeOrigin: true
//     }
//   },
// }
// }
exportsConfig.chainWebpack = function (config) {
  config.module
    .rule('md')
    .test(/\.md$/)
    .use('html-loader')
    .loader('html-loader')
    .end()
    .use('markdown-loader')
    .loader('markdown-loader')
    .options({
      renderer,
      gfm: true,
      tables: true,
      breaks: true,
      // pedantic: true,
      // sanitize: true,
      // smartLists: true,
      // smartypants: true,
      html: true,
      // highlight: renderHighlight,
    })
}
module.exports = exportsConfig
