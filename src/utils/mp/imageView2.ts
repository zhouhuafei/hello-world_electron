// 七牛云官方文档 - 图片处理：https://developer.qiniu.com/dora/1279/basic-processing-images-imageview2
// 七牛云官方文档 - 视频处理：https://developer.qiniu.com/dora/1313/video-frame-thumbnails-vframe
// 腾讯云官方文档 - 图片处理：https://cloud.tencent.com/document/product/1246/45370
// 腾讯云官方文档 - 视频处理：https://cloud.tencent.com/document/product/436/55671
// 阿里云官方文档 - 图片处理：https://www.alibabacloud.com/help/zh/oss/user-guide/overview-17/
// 阿里云官方文档 - 视频处理：https://www.alibabacloud.com/help/zh/oss/user-guide/video-snapshots

export const imageView2 = (url = '', options = { w: 750 }) => {
  url = url || ''
  url = url.trim()
  if (!url) return ''

  let symbol = '?'
  if (url.includes('?')) {
    symbol = '&'
  }
  const w = options?.w || 750

  if (!url.includes('imageView2/2/w/')) {
    url += `${symbol}imageView2/2/w/${w}` // 七牛云、腾讯云
    url += `&x-oss-process=image/resize,w_${w}` // 阿里云
  }

  return url
}

export const videoView2 = (url = '', options = { offset: 1 }) => {
  url = url || ''
  url = url.trim()
  if (!url) return ''

  let symbol = '?'
  if (url.includes('?')) {
    symbol = '&'
  }
  const offset = options?.offset || 1

  if (!url.includes('vframe/jpg/offset/')) {
    url += `${symbol}vframe/jpg/offset/${offset}` // 七牛云
    url += `&ci-process=snapshot&format=jpg&time=${offset}` // 腾讯云
    url += `&x-oss-process=video/snapshot,f_jpg,t_${offset}` // 阿里云
  }

  return url
}
