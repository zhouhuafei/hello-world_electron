<template>
  <button @click="thisMethods.uploadFile">上传pdf文件</button>
</template>

<script setup lang="ts">
import { mp } from './utils/mp'

const thisMethods = {
  async uploadFile () {
    const res: any = await mp.chooseMedia({ count: 1 })
    const tempFiles = res.tempFiles.filter(tempFile => tempFile.tempFilePath.type.includes('image/'))
    const filePath = tempFiles.map(tempFile => tempFile.tempFilePath)[0].path
    window.ipcRenderer.invoke('upload-file', filePath).then((response) => {
      console.log('图片处理后的路径:', response)
    })
  }
}
</script>

<style scoped lang="scss">
</style>
