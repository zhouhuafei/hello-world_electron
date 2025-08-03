import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import Koa from 'koa'
import staticServe from 'koa-static'
import Router from 'koa-router'
import WebSocket, { WebSocketServer } from 'ws'
import robot from 'robotjs'
import { exec } from 'child_process'
import open from 'open'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 原有Electron代码
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

// 服务器相关配置
const PORT = VITE_DEV_SERVER_URL ? 5918 : 5919
const localIP = getLocalIP()
const serverUrl = `http://${localIP}:${PORT}`

// 初始化Koa服务器
const appKoa = new Koa()
const router = new Router()

// 路由
router.get('/', (ctx) => {
  ctx.redirect('/controller.html')
})

appKoa.use(router.routes())

// 设置静态文件目录
appKoa.use(staticServe(process.env.VITE_PUBLIC))

// 启动HTTP服务器
const server = appKoa.listen(PORT, () => {
  console.log(`Server running at ${serverUrl}`)
})

// 启动WebSocket服务器
const wss = new WebSocketServer({ server })
wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', (message) => {
    const command = message.toString()
    // console.log(`Received command: ${command}`)

    // 根据命令模拟键盘输入
    if (command === `Ctrl + R`) {
      robot.keyTap('r', ['control'])
    } else if (command === `Ctrl + W`) {
      robot.keyTap('w', ['control'])
    } else if (command === `Ctrl + Shift + T`) {
      robot.keyTap('t', ['control', 'shift'])
    } else if (command === `Open + douyin`) {
      open('https://www.douyin.com')
    } else if (command === `Alt + F4`) {
      robot.keyTap('f4', ['alt'])
    } else if (command === `Win + L`) {
      lockScreen()
    } else if (command === `click`) {
      robot.mouseClick('left')
    } else if (command === `dblclick`) {
      robot.mouseClick('right')
    } else if (command.includes(`mousemove`)) {
      const o = JSON.parse(command)
      // 获取当前鼠标位置
      const currentPos = robot.getMousePos()
      const currentX = currentPos.x
      const currentY = currentPos.y

      // 计算新位置（当前位置 + 增量）
      const base = 10
      const newX = currentX + o.velocityX * base
      const newY = currentY + o.velocityY * base

      // 执行移动
      robot.setMouseDelay(0)
      robot.moveMouse(newX, newY)
    } else {
      robot.keyTap(command)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// 锁屏函数
function lockScreen () {
  exec('rundll32.exe user32.dll,LockWorkStation', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log('Screen is locked.')
  })
}

// 获取本地IP地址
function getLocalIP () {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
  return '127.0.0.1'
}

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
const size = 600

async function createWindow () {
  win = new BrowserWindow({
    title: '抖音遥控器',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.png'),
    width: VITE_DEV_SERVER_URL ? size * 2 : size,
    height: size,
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())

    // 向渲染进程发送服务器URL
    win?.webContents.send('server-url', serverUrl)
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // Set application menu
  if (process.env.NODE_ENV !== 'development') {
    Menu.setApplicationMenu(null)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 暴露服务器URL给渲染进程
ipcMain.handle('get-server-url', () => {
  return serverUrl
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('upload-file', (event, filePath) => {
  console.log('filePath：', filePath)
  return filePath
})
