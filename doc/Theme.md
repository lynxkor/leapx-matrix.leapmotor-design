### Theme
公共样式

## 用法
在scss中的用法
```scss
@import '@leapmotor/design-base/packages/theme/index.scss';

// 直接使用
.u-color {
  color: $--color-primary;
}

// 在root定义后使用
:root {
  --themColor: #{$--color-primary};
}

.el-button--primary {
  border-color: var(--themColor);
  background-color: var(--themColor);
}

```
在js中使用
```javascript
import style from '@leapmotor/design-base/packages/theme/index.scss';

console.log(style)
```
在vue template中使用
```html
<template>
  <div>{{ theme.colorPrimary }}</div>
</template>

<script>
import theme from '@leapmotor/design-base/packages/theme/index.scss'

export default {
  data () {
    return {
      theme
    }
  }
}
</script>
```
