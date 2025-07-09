### OssUploader
Oss上传组件, 支持file对象、base64方式批量/单独上传文件

## 用法
```html
<template>
  <div class="home">
    ossUploader page
    <input type="file" @change="onChange" multiple />

    base64: <textarea v-model="base64" />
    <button @click="base64Upload">
      上传
    </button>
  </div>
</template>

<script>
import { OssUploader } from '@leapmotor/design'

const uploader = OssUploader({
  singleton: true, // 是否单例，默认true，非必需，单例后ossUploader构造函数仅生效一次，之后调用均返回第一次的实例
  securityCheck: false, // 是否需要图片校验，默认false
  onSuccess: (res) => { // 成功回调、非必需
    // [{
    //   url: 文件url, download=1时会返回下载地址，0则为浏览地址
    //   width: 仅图片会返回
    //   height: 仅图片会返回
    //   objectName
    // }]
    console.log('success global', res)
  },
  onError: (res) => { // 失败回调、非必需
    console.log('error global', res)
  },
  onProgress: (data) => {
    console.log('progress global', data)
  }
})
export default {
  name: 'OssUploader',
  data () {
    return {
      base64: '...'
    }
  },
  methods: {
    onChange (e) {
      // 批量上传
      uploader.uploads(e.target.files, {
        onProgress: (data) => {
          // 优先级高于 progress global
          console.log('progress', data)
        },
        onSuccess: (res) => {
          // 优先级同上
          console.log('success', res)
        },
        onError: (res) => {
          // 优先级同上
          console.log('error', res)
        },
        // 优先级同上
        securityCheck: true,
        options: [{
          fileName: 'test_f1.png', // 上传成功后返回的文件名，非必需
          download: 1, // 是否已下载链接形式返回，默认0，非
        }, {
          fileName: 'test_f2.png', // 上传成功后返回的文件名，非必需
          download: 1 // 是否已下载链接形式返回，默认0，非必需
        }]
      })
      // 单文件上传
      // uploader.upload(e.target.files[0], {
      //   onProgress: (data) => {
      //     // 优先级高于 progress global
      //     console.log('progress', data)
      //   },
      //   fileName: 'test_single.png', // 上传成功后返回的文件名，非必需
      //   download: 1 // 是否已下载链接形式返回，默认0，非必需
      // })
    },
    base64Upload () {
      // base64上传
      uploader.uploads([this.base64], {
        options: [{
          fileName: 'test_base64-1.jpg', // 上传成功后返回的文件名，非必需
          download: 1 // 是否已下载链接形式返回，默认0，非必需
        }]
      })
      // uploader.upload(this.base64, {
      //   fileName: 'test_base64-1.jpg', // 上传成功后返回的文件名，非必需
      //   download: 1 // 是否已下载链接形式返回，默认0，非必需
      // })
    }
  }
}
</script>
```