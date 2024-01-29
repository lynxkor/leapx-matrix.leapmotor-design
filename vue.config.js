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

exportsConfig.devServer = {
  host: '0.0.0.0', // 本地开发域名
  proxy: 'http://localhost:4000', // 配置跨域处理,只有一个代理
  disableHostCheck: true,
  proxy: {
    '/api': {
      target: 'https://iqs-sit.leapmotor.com',
      changeOrigin: true
    }
  },
}

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
