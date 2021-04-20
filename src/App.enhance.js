import React from "react"
import { initGaTracking } from "./services/ga"
import MessageService from "./services/message"
import { playPopSound } from "./services/sound"

export const withScripts = Comp => props => {
    React.useEffect(() => {
        console.log("Load scripts...")
        initGaTracking()
    }, [])

    return <Comp {...props}/>
}

export const withMessageFunctions = Comp => props => {
    const [message, setMessage] = React.useState({
        ...MessageService.initialMessage,
        shown: false,
        hiding: false,
    })

    const updateMessageState = () => {
        if (!!MessageService.messages.length) {
            MessageService.activeMessage = MessageService.getTheFirstMessageInQueue()
            if(MessageService.activeMessage.withSound) playPopSound()

            setMessage({
                ...MessageService.activeMessage,
                shown: true,
                hiding: false,
            })
            MessageService.isShowingMessage = true
        } else {
            MessageService.clearIntervalHandlers()

            MessageService.notificationHidingTimeoutHandler = setTimeout(() => {
                setMessage({
                    ...MessageService.activeMessage,
                    shown: true,
                    hiding: true,
                })

                MessageService.notificationGoneTimeoutHandler = setTimeout(() => {
                    setMessage({
                        ...MessageService.activeMessage,
                        value: "",
                        shown: false,
                        hiding: false,
                    })

                    MessageService.activeMessage = null
                }, 200)
            }, 3000)
        }
    }

    const showMessage = ({ type, value, withSound }) => {
        MessageService.clearIntervalHandlers()
        MessageService.clearTimeoutHandlers()

        if (message.type !== type || message.value !== value) {
            if (MessageService.messages.length > 2) {
                MessageService.messages.splice(MessageService.messages.length - 1, 1)
            }

            MessageService.messages.push({
                type,
                value,
                withSound,
            })
        }

        if (!MessageService.activeMessage) {
            updateMessageState()
        }

        MessageService.notificationIntervalHandler = setInterval(() => {
            updateMessageState()
        }, 1500)
    }

    return <Comp {...{
        ...props,
        message,
        showMessage,
    }}/>
}