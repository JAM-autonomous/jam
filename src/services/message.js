class MessageService {
    constructor() {}

    static notificationGoneTimeoutHandler = null
    static notificationHidingTimeoutHandler = null
    static notificationIntervalHandler = null

    static initialMessage = {
        type: "",
        value: ""
    }

    static activeMessage = null
    static messages = []

    static clearTimeoutHandlers = () => {
        clearTimeout(MessageService.notificationGoneTimeoutHandler)
        clearTimeout(MessageService.notificationHidingTimeoutHandler)
    }

    static clearIntervalHandlers = () => {
        clearInterval(MessageService.notificationIntervalHandler)
    }

    static getTheFirstMessageInQueue = () => {
        return MessageService.messages.splice(0, 1)[0]
    }
}

export default MessageService