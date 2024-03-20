// 将base64转换为blob
const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
// 将blob转换为file
const blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

/**
 * @description: base64 to file
 * @param {*} base64
 * @param {*} suffix 后缀
 */
const base64ToFile = (base64) => {
  const blob = dataURLtoBlob(base64)
  const ext = base64.replace(/^data:image\//, '').match(/^\w+/)
  if (!(ext && ext.length)) {
    return null
  }
  return blobToFile(blob, `base64.${ext[0]}`)
}

/**
 * @description: pick attrs
 * @param {*}
 * @return {*}
 */
const pick = (obj, ...keys) => {
  const result = Object.create(null)
  keys.forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

export {
  base64ToFile,
  pick,
}
