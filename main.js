const AutoLaunch = require("auto-launch");
const path = require("path");
const url = require("url");
const { app, BrowserWindow, systemPreferences, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater")

const {
    hasScreenCapturePermission,
    hasPromptedForPermission,
    openSystemPreferences,
    resetPermissions,
} = require("mac-screen-capture-permissions");


async function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        }
    })

    win.loadFile(path.join(__dirname, "./build/index.html"))

    win.once("ready-to-show", () => {
        autoUpdater.checkForUpdatesAndNotify()

        setInterval(() => {
            autoUpdater.checkForUpdatesAndNotify()
        }, 30 * 60 * 1000)
    });

    // win.webContents.openDevTools()
}

app.whenReady().then(() => {
    require("update-electron-app")({
        repo: "github-user/repo",
        updateInterval: "30 minutes",
        logger: require("electron-log"),
    })

    let autoLaunch = new AutoLaunch({
        name: "Jam"
    })

    autoLaunch.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLaunch.enable()
    })

    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
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
    console.log("Quit and install update")
    autoUpdater.quitAndInstall()
})

autoUpdater.on("update-available", () => {
    console.log("Update available")
})

autoUpdater.on("update-downloaded", () => {
    win.webContents.send("new-update-downloaded")
    console.log("Update downloaded")
})