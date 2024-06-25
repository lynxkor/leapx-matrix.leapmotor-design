<template>
  <div class="m-logger">
    logger page
    <br>
    <button @click="log('log')">
      log
    </button>
    <button @click="log('info')">
      info
    </button>
    <button @click="log('warn')">
      warn
    </button>
    <button @click="log('error')">
      error
    </button>
  </div>
</template>

<script>
import { LPLogger } from '../index'

export default {
  name: 'OssUploaderPage',
  data () {
    return {
      lpLogger: null
    }
  },
  mounted () {
    window.LPLogger = new LPLogger({
      url: 'http://localhost:3000/log',
      code: 'Leapmotor-design'
    })
  },
  methods: {
    log (level) {
      console[level]('test')
    }
  }
}
</script>
