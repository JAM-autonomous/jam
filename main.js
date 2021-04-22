const AutoLaunch = require("auto-launch");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, systemPreferences, ipcMain } = require("electron");

const {
    hasScreenCapturePermission,
    hasPromptedForPermission,
    openSystemPreferences,
    resetPermissions,
} = require("mac-screen-capture-permissions");

//global constants and veriables
const FIRST_CHECK_FOR_UPDATE_TIMEOUT = 120000
const CHECK_FOR_UPDATE_INTERVAL = 1800000
const CHECK_FOR_UPDATE_SERVER = "https://update.electronjs.org"
const GITHUB_TOKEN = "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"
const GITHUB_OWNER = "JAM-autonomous"
const GITHUB_REPO_NAME = "jam"
let win

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
            const server = CHECK_FOR_UPDATE_SERVER
            const feed = `${server}/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/${process.platform}-${process.arch}/${app.getVersion()}`

        autoUpdater.setFeedURL({
            url: feed
        })

        setTimeout(() => {
            autoUpdater.checkForUpdates()
        }, FIRST_CHECK_FOR_UPDATE_TIMEOUT)

        setInterval(() => {
            autoUpdater.checkForUpdates()
        }, CHECK_FOR_UPDATE_INTERVAL)
        });
    }
}

app.whenReady().then(() => {
    let autoLaunch = new AutoLaunch({
        name: "Jam"
    })

    autoLaunch.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLaunch.enable()
    })

    createWindow()

    app.on("activate", () => {
        const windows = BrowserWindow.getAllWindows()
        console.log(windows.length)

        if (!windows.length){
            console.log("Creating window")
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    win = null
    
    if (process.platform !== "darwin") {
        app.quit()
    }
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

ipcMain.on("request-restart-app", (event, args) => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on("checking-for-update", () => {
    if (win)
        win.webContents.send("checking-for-update", [])
})

autoUpdater.on("update-not-available", () => {
    if (win)
        win.webContents.send("no-update-available", [])
})

autoUpdater.on("update-available", () => {
    if (win)
        win.webContents.send("new-update-available")
})

autoUpdater.on("update-downloaded", () => {
    if (win)
        win.webContents.send("new-update-downloaded")
})

autoUpdater.on("error", message => {
    if (win)
        win.webContents.send("auto-update-error", [message])
})