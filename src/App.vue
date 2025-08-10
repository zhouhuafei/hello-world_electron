<template>
  <!--<div @click.stop="thisMethods.uploadFile">上传文件</div>-->

  <div class="app-container">
    <h1>使用手机控制网页版抖音</h1>
    <p>请使用手机扫描下方二维码</p>
    <div class="qr-code-container">
      <img :src="qrCodeUrl" alt="控制页面二维码" v-if="qrCodeUrl">
      <p v-else>加载二维码中...</p>
    </div>
    <!--<p class="url">{{ serverUrl }}</p>-->
    <p class="instructions">扫描后可以在手机上对网页版抖音进行控制</p>
    <p class="rewardTheDeveloper" @click.stop="rewardTheDeveloper">支持开发者</p>
    <div v-if="showRewardModal" class="reward-modal-mask" @click.stop="closeRewardModal">
      <div class="reward-modal">
        <div class="close-btn" @click.stop="closeRewardModal">×</div>
        <h3>支持开发者</h3>
        <div class="qrcode-container">
          <img src="/PayWeChat.jpg" alt="微信支付二维码" class="reward-qrcode">
        </div>
        <p class="reward-desc">使用微信扫码对开发者进行支持</p>
        <p class="reward-motivation">您的支持是开发者持续更新的动力</p>
      </div>
    </div>
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
const showRewardModal = ref(false)
const rewardTheDeveloper = () => (showRewardModal.value = true)
const closeRewardModal = () => (showRewardModal.value = false)

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
  padding-top: 20px;
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
  margin: 20px 0 0;
}

.rewardTheDeveloper {
  color: green;
  font-size: 14px;
  margin: 0;
  padding: 20px 0;
  cursor: pointer;
}

.reward-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.reward-modal {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
}

.qrcode-container {
  padding: 10px;
  background-color: white;
  display: inline-block;
  border-radius: 8px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}

.reward-qrcode {
  width: 200px;
  height: 276px;
  display: block;
}

.reward-desc {
  color: #333;
  margin: 10px 0;
  font-size: 14px;
}

.reward-motivation {
  color: #666;
  font-size: 12px;
  margin-top: 15px;
  line-height: 1.5;
}
</style>
