const name = 'index'
const path = require('path')
// const { VueLoaderPlugin } = require('vue-loader')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    [name]: './src/index.js' // 入口文件
  },
  output: {
    path: path.resolve(__dirname, '../dist'), // 出口目录
    // publicPath: '/dist/',
    publicPath: './',
    library: name, // 包名
    libraryTarget: 'umd',
    umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },
  // externals: {
  //   vue: {
  //     root: 'Vue',
  //     commonjs: 'vue',
  //     commonjs2: 'vue',
  //     amd: 'vue'
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'sass-loader', // 这里不编译，直接输出，项目侧需要使用 sass-loader 编译
        ],
      },
      // {
      //   test: /\.(less|css)$/,
      //   use: ['vue-style-loader',
      //     // {
      //     //   loader: MiniCssExtractPlugin.loader,
      //     //   options: {
      //     //     publicPath: '../'
      //     //   },
      //     // },
      //     {
      //       loader: 'css-loader',
      //     // options: {
      //     //   sourceMap: false,
      //     //   importLoaders: 2,
      //     //   modules: {
      //     //     localIdentName: '[name]_[local]_[hash:base64:5]'
      //     //   }
      //     // }
      //     }, 'less-loader'],
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader'
      // },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          /* config.module.rule('svg').use('file-loader') */
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
    ]
  },
  // optimization: {
  //   minimizer: [
  //     // 在生产模式下，webpack 默认包含 TerserPlugin 来压缩 JS
  //     // 添加 OptimizeCSSAssetsPlugin 来压缩 CSS
  //     new OptimizeCSSAssetsPlugin({
  //       cssProcessorOptions: {
  //         safe: true, // 启用安全选项，避免删除必要的空白符或注释
  //         discardComments: { removeAll: true }, // 删除所有注释
  //       },
  //     }),
  //   ],
  // },
  plugins: [
    // new VueLoaderPlugin(),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      // 类似 webpackOptions.output里面的配置 可以忽略
      filename: '[name].scss',
      chunkFilename: '[id].scss',
    }),
    // new OptimizeCSSAssetsPlugin()
  ],
}
