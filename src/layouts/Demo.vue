<template>
  <article>
    <section class="markdown">
      <h1>
        {{ demoInfo.name }}
        <span class="subtitle">{{ demoInfo.subname || '' }}</span>
      </h1>
    </section>
    <section class="markdown">
      <h2>使用示例</h2>
    </section>
    <slot />
    <section class="markdown" v-if="mdFile">
      <h2>文档说明</h2>
    </section>
    <section class="markdown api-container" v-html="mdFile" v-highlight></section>
  </article>
</template>

<script>
const needConvertInitials = ['ossUploader', 'theme']
export default {
  props: {
    demoInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api: {},
      mdFile: ''
    }
  },
  watch: {
    demoInfo: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.getApiDoc(val)
        }
      }
    }
  },
  methods: {
    getApiDoc (value) {
      if (value && value.name) {
        let fileName = value.name
        if (needConvertInitials.indexOf(value.name) > -1) {
          fileName = value.name.replace(/^\S/, s => s.toUpperCase())
        }
        import(`../../doc/${fileName}.md`).then(res => {
          this.mdFile = res.default
        }).catch((error) => {
          console.log(error)
          this.mdFile = ''
        })
      }
    }
  }
}
</script>

<style lang="less">
@import './Demo.less';
.markdown {
  color: #000000d9;
  font-size: 14px;
  line-height: 2;
  h1 {
    margin-top: 8px;
    margin-bottom: 20px;
    color: #000000d9;
    font-weight: 500;
    font-size: 30px;
    font-family: Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji",sans-serif;
    line-height: 38px;
    .subtitle {
      margin-left: 12px;
    }
  }
  pre {
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
  }
}
</style>
