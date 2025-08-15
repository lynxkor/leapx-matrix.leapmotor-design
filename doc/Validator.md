### Theme
逻辑校验组件

## 用法
手机号正则

```javascript
import { REGEX_CN_PHONE } from '@leapmotor/design/packages/utils/validator'

console.log(REGEX_CN_PHONE)
// 11位手机号（13-9开头）
console.log(REGEX_CN_PHONE.test('13812345678'))
console.log(REGEX_CN_PHONE.test('15987654321'))
console.log(REGEX_CN_PHONE.test('+8613812345678'))
console.log(REGEX_CN_PHONE.test('8613812345678'))

// 不匹配错误的手机号
console.log(REGEX_CN_PHONE.test('12345678901')) // 不是1[3-9]开头
console.log(REGEX_CN_PHONE.test('1381234567')) // 不足11位
```
