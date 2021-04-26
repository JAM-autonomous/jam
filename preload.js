const { desktopCapturer, ipcRenderer } = require("electron")

window.addEventListener('DOMContentLoaded', async () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

    const handleGetAvailableScreenSourcesToShareScreen = async () => {
        const MAXIMUM_RETRY_TIMES = 3
        let screenSourcesUpdated = false
        let retriedGettingScreenSourcesTimes = 0
        let retriedGettingShareScreenButton = 0
        let shareScreenButton = null

        let intervalHandler = setInterval(() => {
            shareScreenButton = document.getElementById("share-screen-button")
            if (shareScreenButton) {
                registerClickEventListenerForShareScreenButton(shareScreenButton)
                clearInterval(intervalHandler)
            }
        }, 1000)

        const registerClickEventListenerForShareScreenButton = () => {
            shareScreenButton.onclick = async e => {
                if (!document.getElementsByClassName("agora_video_player").length) {
                    if (!screenSourcesUpdated) {
                        e.stopPropagation()
                        ipcRenderer.send("request-get-screen-permission-status", [])
                    } else {
                        screenSourcesUpdated = false
                    }
                }
            }
        }

        const getScreenSources = () => {
            console.log("[Electron-preload] Trying to get available screen sources")

            return new Promise(async (resolve) => {
                const sources = await desktopCapturer.getSources({ types: ['screen'] })

                if (!sources || !sources.length && retriedGettingScreenSourcesTimes < MAXIMUM_RETRY_TIMES) {
                    setTimeout(async () => {
                        retriedGettingScreenSourcesTimes += 1
                        await getScreenSources()
                    }, 500)
                } else {
                    resolve(sources || [])
                }
            })
        }

        const showPermissionPopup = () => {
            const popup = document.createElement("div"),
                popupMainContent = document.createElement("div"),
                popupActions = document.createElement("div")

            popup.classList.add("screen-sharing-permission-popup")
            popup.setAttribute("id", "screen-sharing-permission-popup")
            popupMainContent.classList.add("main-content")
            popupActions.classList.add("actions")

            popupMainContent.innerHTML = `
                <h3>Allow JAM to share your screen</h3>
                <p>Open <b>System Preferences</b> > <b>Security & Privacy</b> to grant access.</p>
            `

            const cancelButton = document.createElement("button"),
                primaryButton = document.createElement("button")

            primaryButton.classList.add("primary")
            cancelButton.innerHTML = "Cancel"
            primaryButton.innerHTML = "Open system preferences"

            cancelButton.onclick = () => {
                document.getElementById("screen-sharing-permission-popup").remove()
            }

            primaryButton.onclick = () => {
                ipcRenderer.send("request-open-system-preferences", [])
            }

            popupActions.appendChild(cancelButton)
            popupActions.appendChild(primaryButton)
            popupMainContent.appendChild(popupActions)

            popup.appendChild(popupMainContent)
            document.getElementById("root").appendChild(popup)
        }

        ipcRenderer.on("request-get-screen-permission-status-reply", async (events, args) => {
            console.log("[Electron-preload] args", args)

            if (args[0] === "yes") {
                const globalDataDOMElement = document.getElementById("global-data")
                const sources = await getScreenSources()
                globalDataDOMElement.setAttribute("screen-sources", JSON.stringify(sources))
                screenSourcesUpdated = true
                shareScreenButton.click()
            } else {
                showPermissionPopup()
            }
        })

        ipcRenderer.on("system-preferences-opened", (event, args) => {
            document.getElementById("screen-sharing-permission-popup").remove()
        })
    }
    
    handleGetAvailableScreenSourcesToShareScreen()
})