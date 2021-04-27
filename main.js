const AutoLaunch = require("auto-launch");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, systemPreferences, ipcMain, autoUpdater } = require("electron");
const ElectronUtil = require('electron-util');

const {
    hasScreenCapturePermission,
    hasPromptedForPermission,
    openSystemPreferences,
    resetPermissions,
} = require("mac-screen-capture-permissions");

//global constants and veriables
let win
let autoLaunch = null
let checkForUpdateIntervalHandler = null

function createWindow() {
    if (!win) {
        win = new BrowserWindow({
            width: 1280,
            height: 768,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: true,
            }
        })

        win.loadFile(path.join(__dirname, "./build/index.html"))

        win.once("ready-to-show", () => {
            const server = 'https://update.electronjs.org'
            const feed = `${server}/JAM-autonomous/jam/${process.platform}-${process.arch}/${app.getVersion()}`
            autoUpdater.setFeedURL({
                url: feed
            })

            autoUpdater.checkForUpdates()

            checkForUpdateIntervalHandler = setInterval(() => {
                autoUpdater.checkForUpdates()
            }, 30 * 60 * 1000)
        });
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        const windows = BrowserWindow.getAllWindows()
        if (!windows.length) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    win = null
    if(process.platform !== "darwin")
        app.quit()
})

app.on("before-quit", console.log);

ipcMain.on("request-get-screen-permission-status", (event, args) => {
    const screenStatus = systemPreferences.getMediaAccessStatus("screen")
    event.sender.send("request-get-screen-permission-status-reply", [screenStatus !== "denied" ? "yes" : "no"])
})

ipcMain.on("request-open-system-preferences", async (event, args) => {
    const promptedForPermissionStatus = hasPromptedForPermission()

    if (promptedForPermissionStatus) {
        await openSystemPreferences()
        event.sender.send("system-preferences-opened", [])
    } else {
        await hasScreenCapturePermission()
        event.sender.send("system-preferences-opened", [])
    }
})

ipcMain.on("request-get-microphone-permission", (event, args) => {
    const microphonePermission = systemPreferences.getMediaAccessStatus("microphone")
    event.sender.send("request-get-microphone-permission-reply", [microphonePermission])
})

ipcMain.on("request-ask-for-microphone-permission", async (event, args) => {
    const permission = await systemPreferences.askForMediaAccess("microphone")
})

ipcMain.on("request-open-security-settings", (event, args) => {
    ElectronUtil.openSystemPreferences("security", "Privacy")
})

ipcMain.on("request-get-auto-start-up-permission", (event, args) => {
    if (process.platform === "darwin") {
        const isAutoStart = app.getLoginItemSettings().wasOpenedAtLogin

        if (win)
            win.webContents.send("request-get-auto-start-up-permission-reply", [isAutoStart])
    } else {
        autoLaunch = new AutoLaunch({
            name: "Jam"
        })
        autoLaunch.isEnabled().then((isEnabled) => {
            if (win)
                win.webContents.send("request-get-auto-start-up-permission-reply", [isEnabled])
        })
    }
})

ipcMain.on("allow-auto-start", (event, args) => {
    if (process.platform === "darwin") {
        app.setLoginItemSettings({ openAtLogin: true, args: ['--startup'] })
    } else {
        autoLaunch.enable()
    }
})

ipcMain.on("request-install-and-restart", (event, args) => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on("update-downloaded", () => {
    clearInterval(checkForUpdateIntervalHandler)
    if (win)
        win.webContents.send("update-downloaded", [])
})