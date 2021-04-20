import { randomString } from "../helper/utils"

export const maximumHistoryRecords = 20

export const callHistoryLocalStorageKey = "call-history"

export const callHistoryType = {
    joiningExistedRoom: "joiningExistedRoom",
    incomingCall: "incomingCall",
    startingNewCall: "startingNewCall",
    missingCall: "missingCall"
}

export const getCallHistoryFromLocalStorage = () => {
    try {
        const data = JSON.parse(localStorage.getItem(callHistoryLocalStorageKey))
        if (data)
            return {
                users: data.users,
                calls: data.calls,
            }
    } catch (e) {
        localStorage.removeItem(callHistoryLocalStorageKey)
    }

    return {
        users: [],
        calls: [],
    }
}

class CallHistoryService {
    static currentCallId = null
    static onAddNewRecord = null
    static onHasMissedCall = null

    static triggerOnAddNewRecord = records => {
        if (CallHistoryService.onAddNewRecord && typeof CallHistoryService.onAddNewRecord == "function")
            CallHistoryService.onAddNewRecord(records)
    }

    static triggerOnHasMissedCall = () => {
        if(CallHistoryService.onHasMissedCall && typeof CallHistoryService.onHasMissedCall == "function"){
            CallHistoryService.onHasMissedCall()
        }
    }

    static get() {
        return getCallHistoryFromLocalStorage()
    }

    static add({
        startTime,
        endTime,
        users,
        type,
    }) {
        let currentHistory = getCallHistoryFromLocalStorage()
        if (currentHistory.calls.length >= maximumHistoryRecords)
            currentHistory.calls.splice(0, 1)

        currentHistory.calls.push({
            id: randomString(10),
            startTime: startTime || +new Date(),
            endTime,
            users,
            type,
        })

        CallHistoryService.triggerOnAddNewRecord(currentHistory.calls)
        CallHistoryService.updateHistoryUsers(currentHistory, users)

        localStorage.setItem(callHistoryLocalStorageKey, JSON.stringify(currentHistory))
    }

    static updateHistoryUsers = (history, users) => {
        users.forEach(usr => {
            const existedUser = history.users.find(o => o.id == usr.id)
            if (existedUser) {
                existedUser.callsNumber += 1
            } else {
                history.users.push({
                    ...usr,
                    callsNumber: 1
                })
            }
        })
    }

    static getCurrentCall = history => {
        let currentCall

        if (CallHistoryService.currentCallId) {
            currentCall = history.calls.find(o => o.id == CallHistoryService.currentCallId)
        } else {
            currentCall = history.calls[history.calls.length - 1]
        }

        return currentCall
    }

    static addUsersToTheCurrentCall = users => {
        const history = CallHistoryService.get()

        const currentCall = CallHistoryService.getCurrentCall(history)

        if (currentCall) {
            currentCall.joinedUsers = users
                .filter(o => !currentCall.users.find(usr => usr.id == o.id))
                .map(o => ({ id: o.id, email: o.email }))

            CallHistoryService.triggerOnAddNewRecord(history.calls)
            CallHistoryService.updateHistoryUsers(history, currentCall.joinedUsers)

            localStorage.setItem(callHistoryLocalStorageKey, JSON.stringify(history))
        }
    }

    static updateTypeOfTheCurrentCall = type => {
        const history = CallHistoryService.get()

        const currentCall = CallHistoryService.getCurrentCall(history)
        if (currentCall) {
            currentCall.type = type

            CallHistoryService.triggerOnAddNewRecord(history.calls)

            localStorage.setItem(callHistoryLocalStorageKey, JSON.stringify(history))
        }
    }

    static markAllAsRead = () => {
        const history = CallHistoryService.get()

        history.calls = history.calls.map(o => ({...o, isRead: true}))

        localStorage.setItem(callHistoryLocalStorageKey, JSON.stringify(history))
    }
}

export default CallHistoryService