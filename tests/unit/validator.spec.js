// regex.test.js
import { REGEX_CN_PHONE } from '@leapmotor/design-base/packages/utils/validator'

describe('REGEX_CN_PHONE', () => {
  test('should match Chinese mobile numbers', () => {
    // 11位手机号（13-9开头）
    expect('13812345678').toMatch(REGEX_CN_PHONE)
    expect('15987654321').toMatch(REGEX_CN_PHONE)
    expect('+8613812345678').toMatch(REGEX_CN_PHONE)
    expect('8613812345678').toMatch(REGEX_CN_PHONE)

    // 不匹配错误的手机号
    expect('12345678901').not.toMatch(REGEX_CN_PHONE) // 不是1[3-9]开头
    expect('1381234567').not.toMatch(REGEX_CN_PHONE) // 不足11位
  })

  test('should match Chinese landline numbers', () => {
    // 座机号（带区号）
    expect('010-12345678').toMatch(REGEX_CN_PHONE)
    expect('051212345678').toMatch(REGEX_CN_PHONE)
    expect('07551234567').toMatch(REGEX_CN_PHONE)

    // 不匹配错误的座机号
    expect('0123-456789').not.toMatch(REGEX_CN_PHONE) // 区号错误
    expect('010123456').not.toMatch(REGEX_CN_PHONE) // 号码位数不足
  })
})
