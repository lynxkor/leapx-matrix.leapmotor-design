<template>
  <div class="m-ossUploader">
    ossUploader page
    <input
      type="file"
      multiple
      @change="onChange"
    >
    <br>
    <br>
    base64: <textarea v-model="base64" />
    <button @click="base64Upload">
      上传
    </button>
  </div>
</template>

<script>
import { OssUploader } from '../../index'
import base64Content from './base64'

const uploader = OssUploader({
  singleton: true, // 是否单例，默认true，非必需，单例后OssUploader构造函数仅生效一次，之后调用均返回第一次的实例
  securityCheck: false,
  overwrite: false,
  region: 'oss-cn-hangzhou-internal',
  // 请求钩子，可对url、params进行定制
  onBeforeRequest: (url, params) => {
    // params.custom = 'custom data'
    return { url, params }
  },
  onSuccess: (res) => { // 成功回调、非必需
    // [{
    //   url: 文件url, download=1时会返回下载地址，0则为浏览地址
    //   width: 仅图片会返回
    //   height: 仅图片会返回
    //   data: bucketName, objectKey
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
  name: 'OssUploaderPage',
  data () {
    return {
      base64: base64Content
    }
  },
  methods: {
    onChange (e) {
      // 批量上传
      uploader.uploads(e.target.files, {
        options: Array.from({ length: e.target.files.length }, () => { return { headers: { test: 'test' } } }),
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
        securityCheck: true
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
          fileName: 'test_base64-1.png', // 上传成功后返回的文件名，非必需
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
