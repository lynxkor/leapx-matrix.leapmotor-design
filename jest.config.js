const { jest } = require('./package.json')

module.exports = {
  // preset: 'ts-jest',
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  reporters: ['default'],
  coverageReporters: ['html', 'lcov', 'text-summary', 'json-summary'],
  collectCoverageFrom: [
    'packages/**/*.js',
    'packages/**/*.vue',
  ],
  coveragePathIgnorePatterns: [
    'packages/(font|helloWorld|button|cropper)'
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['vue', 'js', 'json'],
  transform: {
    // 用 `vue-jest` 处理 `*.vue` 文件
    '.*\\.(vue)$': 'vue-jest',
    // 用 `babel-jest` 处理 js
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!ant-design-vue)'
  ],
  rootDir: __dirname,
  // testMatch: [
  //   '<rootDir>/tests/unit/**/*spec.[jt]s(x)?',
  // ],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: jest.coverageThreshold,
}
