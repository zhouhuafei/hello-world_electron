<template>
  <!--<button @click="thisMethods.uploadFile">上传文件</button>-->

  <div class="app-container">
    <h1>使用手机控制网页版抖音</h1>
    <p>请使用手机扫描下方二维码</p>
    <div class="qr-code-container">
      <img :src="qrCodeUrl" alt="控制页面二维码" v-if="qrCodeUrl">
      <p v-else>加载二维码中...</p>
    </div>
    <!--<p class="url">{{ serverUrl }}</p>-->
    <p class="instructions">
      扫描后可以在手机上对网页版抖音进行控制
    </p>
  </div>
</template>

<script setup lang="ts">
import { mp } from './utils/mp'
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

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

const serverUrl = ref('')
const qrCodeUrl = ref('')

onMounted(async () => {
  // 从主进程获取服务器URL
  const url = await window.ipcRenderer.invoke('get-server-url')
  serverUrl.value = url

  // 生成二维码
  try {
    qrCodeUrl.value = await QRCode.toDataURL(url)
  } catch (error) {
    console.error('生成二维码失败:', error)
  }

  // 监听主进程发送的URL（如果有更新）
  window.ipcRenderer.on('server-url', (_, url) => {
    serverUrl.value = url
    QRCode.toDataURL(url).then(dataUrl => {
      qrCodeUrl.value = dataUrl
    })
  })
})
</script>

<style scoped lang="scss">
.app-container {
  text-align: center;
  padding-top: 30px;
}

h1 {
  font-size: 2.6em;
}

.qr-code-container {
  margin: 20px auto;
  width: 250px;
  height: 250px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.qr-code-container img {
  width: 100%;
  height: 100%;
}

.url {
  color: #666;
  font-size: 14px;
  word-break: break-all;
  max-width: 90%;
  margin: 0 auto 20px;
}

.instructions {
  color: #888;
  font-size: 14px;
  margin-top: 20px;
}
</style>
