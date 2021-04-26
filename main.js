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
            require("update-electron-app")()
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
        if (!windows.length) {
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