/*
**  Nuxt.js part
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
let win = null // Current window

const http = require('http')
const {Nuxt, Builder} = require('nuxt')

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
config.rootDir = __dirname // for electron-packager

// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)

// Build only in dev mode
if (config.dev) {
    builder.build()
        .catch((error) => {
            console.error(error) // eslint-disable-line no-console
            process.exit(1)
        })
}

// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}`
console.log(`Nuxt working on ${_NUXT_URL_}`)

/*
** Electron app
*/
const electron = require('electron')
const path = require('path')
const url = require('url')
const { autoUpdater } = require('electron-updater')
const ipcMain = electron.ipcMain

updateHandle()
const POLL_INTERVAL = 300
const pollServer = () => {
    http.get(_NUXT_URL_, (res) => {
        const SERVER_DOWN = res.statusCode !== 200
        SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL(_NUXT_URL_)
    })
        .on('error', pollServer)
}

const app = electron.app
const bw = electron.BrowserWindow

const newWin = () => {
    win = new bw({
        width: config.electron.width || 800,
        height: config.electron.height || 600,
        title: '易戴易美后台管理系统',
        icon: 'logo.ico',
        webPreferences: {webSecurity: false}
        // frame: false
    })
    win.setMenu(null)
    win.webContents.openDevTools()
    if (!config.dev) {
        return win.loadURL(_NUXT_URL_)
    }
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.on('closed', () => win = null)
    pollServer()
}
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新'
    };
    const os = require('os');

    autoUpdater.setFeedURL('https://static.9999ax.com');
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        win.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {

        ipcMain.on('isUpdateNow', (e, arg) => {
            console.log(arguments);
            console.log('开始更新');
            // some code here to handle event
            autoUpdater.quitAndInstall();
        });

        win.webContents.send('isUpdateNow')
    });
    console.log('ss')
    ipcMain.on('checkForUpdate', (e) => {
        // 执行自动更新检查
        autoUpdater.checkForUpdates();
    })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    console.log(text)
    win.webContents.send('message', text)
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
