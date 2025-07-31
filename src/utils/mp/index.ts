import { setStorageSync, removeStorageSync, clearStorageSync, getStorageSync } from './localStorage'
import { setErrorInfo, getErrorInfo, getError, getErrorMessage } from './error'
import { setClipboardData, getClipboardData } from './clipboard'
import { imageView2, videoView2 } from './imageView2'
import { px2upx } from './px2upx'

export const mp = {
  // 常量

  // 变量

  // 方法
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  clearStorageSync,
  setErrorInfo,
  getErrorInfo,
  getError,
  getErrorMessage,
  setClipboardData,
  getClipboardData,
  imageView2,
  videoView2,
  px2upx,

  setNavigationBarTitle (options: any = {}) {
    document.title = options.title || ''
  },
  makePhoneCall (options: any = {}) {
    const a = document.createElement('a')
    a.href = `tel:${options.phoneNumber}`
    a.click()
  },
  chooseMedia (options: any = {}) {
    return new Promise((resolve, reject) => {
      options.count = options.count || 1
      const imageMimeType = [
        'image/jpeg', 'image/png', 'image/gif', // .jpg|.jpeg/.png/.gif
        'image/webp', 'image/svg+xml', 'image/bmp', // .webp/.svg/.bmp
        'image/x-icon', 'image/vnd.microsoft.icon' // .ico
      ]
      const videoMimeType = [
        'video/mp4' // .mp4
      ]
      const audioMimeType = [
        'audio/mpeg' // .mp3
      ]
      const excelMimeType = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
      ]
      if (options.mediaType) {
        const mimeType = []
        if (options.mediaType.includes('image/')) {
          mimeType.push(...options.mediaType)
        } else if (options.mediaType.includes('image')) {
          mimeType.push(...imageMimeType)
        }
        if (options.mediaType.includes('video/')) {
          mimeType.push(...options.mediaType)
        } else if (options.mediaType.includes('video')) {
          mimeType.push(...videoMimeType)
        }
        if (options.mediaType.includes('audio/')) {
          mimeType.push(...options.mediaType)
        } else if (options.mediaType.includes('audio')) {
          mimeType.push(...audioMimeType)
        }
        if (options.mediaType.includes('application/')) {
          mimeType.push(...options.mediaType)
        } else if (options.mediaType.includes('excel')) {
          mimeType.push(...excelMimeType)
        }
        options.mediaType = mimeType
      } else {
        options.mediaType = imageMimeType
      }
      const input = document.createElement('input')
      input.addEventListener('change', (e: any) => {
        const tempFiles = [...e.target.files]
        if (tempFiles.length > options.count) {
          const message = `最多上传${options.count}个文件`
          console.log(message)
          reject(new Error(message))
        } else {
          resolve({ tempFiles: tempFiles.map(file => ({ tempFilePath: file })) })
        }
      })
      input.type = 'file'
      input.accept = options.mediaType.join(',')
      if (options.count > 1) {
        input.setAttribute('multiple', 'multiple')
      }
      input.click()
    })
  }
}

console.log('mp：', mp)
