<template>
  <div class="m-validator">
    <input type="text" v-model="phone" />
    <div>
      大陆手机号校验：
      <template v-if="phone">
        <span v-if="!isPhone" class="z-red">校验失败</span>
        <span v-else class="z-green">校验成功</span>
      </template>
    </div>
  </div>
</template>

<script>
import { REGEX_CN_PHONE } from '@leapmotor/design-base/packages/utils/validator'

export default {
  data() {
    return {
      phone: ''
    }
  },
  computed: {
    isPhone() {
      return REGEX_CN_PHONE.test(this.phone)
    }
  }
}
</script>

<style lang="scss" scoped>
.z-green {
  color: green;
}

.z-red {
  color: red;
}
</style>
