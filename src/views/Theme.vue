<template>
  <div :style="`color: ${theme.colorPrimary};`">{{ theme.colorPrimary }}</div>
</template>

<script>
import theme from '../../packages/theme/index.scss'

export default {
  data () {
    return {
      theme
    }
  }
}
</script>
