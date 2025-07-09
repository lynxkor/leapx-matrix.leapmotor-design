module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', { modules: 'commonjs' }] // 强制使用 CommonJS
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-transform-modules-commonjs' // 转换 ESM → CJS
  ]
}
