const wx = {
  async setClipboardData (options) {
    const val = options.data || ''

    if (navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(val)
      } catch (e) {
        console.log('e：', e)
        setClipboardData2()
      }
    } else {
      setClipboardData2()
    }

    function setClipboardData2 () {
      const input = document.createElement('textarea')
      input.value = val
      document.body.appendChild(input)
      input.select()
      input.blur()
      document.execCommand('Copy')
      document.body.removeChild(input)
    }
  },
  setNavigationBarTitle (options) {
    document.title = options.title || ''
  },
  uploadFile (options = {}) {
    const formData = new FormData()
    Object.keys(options.formData).forEach((key) => {
      const val = options.formData[key]
      formData.append(key, val)
    })
    formData.append('file', options.filePath)
  },
  chooseFile (options = {}) {
    const input = document.createElement('input')
    input.addEventListener('change', (e) => {
      const tempFilePaths = e.target.files
      if (tempFilePaths.length > options.count) {
        const message = `最多上传${options.count}个文件`
        console.error(message)
        options.fail && options.fail({ message })
      } else {
        options.success && options.success({ tempFilePaths })
      }
    })
    input.type = 'file'
    if (options.count > 1) {
      input.setAttribute('multiple', 'multiple')
    }
    input.click()
  },
  chooseImage (options = {}) {
    options.mimeType = options.mimeType || ['image/jpeg', 'image/png', 'image/gif']
    const input = document.createElement('input')
    input.addEventListener('change', (e) => {
      const tempFilePaths = e.target.files
      if (tempFilePaths.length > options.count) {
        const message = `最多上传${options.count}个文件`
        console.error(message)
        options.fail && options.fail({ message })
      } else {
        options.success && options.success({ tempFilePaths })
      }
    })
    input.type = 'file'
    input.accept = options.mimeType.join(',')
    if (options.count > 1) {
      input.setAttribute('multiple', 'multiple')
    }
    input.click()
  },
  makePhoneCall (options) {
    const a = document.createElement('a')
    a.href = `tel:${options.phoneNumber}`
    a.click()
  }
}

console.log('wx：', wx)

export { wx }
