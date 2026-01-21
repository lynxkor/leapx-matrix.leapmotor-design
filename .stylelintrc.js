const rules = require('@leapmotor/design-base/packages/stylelint/index.js')

module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-html'
  ],
  overrides: [
    {
      files: ['**/*.{html,vue}'],
    }
  ],
  rules: {
    ...rules
  }
}
