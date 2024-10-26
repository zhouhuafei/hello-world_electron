<template>
  <button @click="thisMethods.uploadFile">上传pdf文件</button>
</template>

<script setup lang="ts">
import { wx } from './utils/wx.ts'

const thisMethods = {
  uploadFile () {
    wx.chooseFile({
      success (e) {
        console.log('e：', e)
        const filePath = Array.from(e.tempFilePaths).map(v => v.path)
        window.ipcRenderer.invoke('upload-file', filePath).then((response) => {
          console.log('图片处理后的路径:', response)
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
</style>
