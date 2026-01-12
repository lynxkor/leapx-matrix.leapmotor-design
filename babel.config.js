module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset'] // 强制使用 CommonJS
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ['import', { libraryName: 'vxe-table', style: true }, 'vxe-table'],
    ['import', { libraryName: 'vxe-pc-ui', style: true }, 'vxe-pc-ui']
  ]
}

// module.exports = {
//   presets: [
//     ['@vue/cli-plugin-babel/preset', { modules: 'commonjs' }] // 强制使用 CommonJS
//   ],
//   plugins: [
//     [
//       'component',
//       {
//         libraryName: 'element-ui',
//         styleLibraryName: 'theme-chalk'
//       }
//     ],
//     '@babel/plugin-transform-modules-commonjs' // 转换 ESM → CJS
//   ]
// }
