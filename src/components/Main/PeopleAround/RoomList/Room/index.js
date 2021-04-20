import React from "react"
import styles from "./styles.module.scss"
import { aaTrack } from "../../../../../services/tracking"
import { TRACK_DEFINE } from "../../../../../services/tracking/define"
import http from "../../../../../services/http"
import { logService } from "../../../../../services/log"
import { getNameFromEmail } from "../../../../../helper/utils.js"
import CallHistoryService, { callHistoryType } from "../../../../../services/callHistory"

//resources
import TalkingIcon from "../../../../../resources/images/talking-ic.svg"

//components
import { Button } from "../../../../core/Button"

//User component
const UserComponent = ({ data }) => (
    <div className={styles.userName}>
        {getNameFromEmail(data.email)}
    </div>
)

const Room = ({ room, auth, agoraClient, messageQueueManager, isCurrentUserTalking, showMessage }) => {
    const Log = logService.createLog("Room", { logToServer: true, roomId: room.id })

    const { id, users } = room || {}
    const { id: userId } = auth

    let displayedUsers = users.concat([]).slice(0, 3)
    let remainingUsersCount = Math.max((users.length - 3), 0)

    const handleJoinRoom = async () => {
        try {
            aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_JOIN);
            Log.info('Request join room', id);

            /**
             * Using Agora
             */
            await agoraClient.stop();

            const room = await http.post('api/room/join', { roomId: id });

            console.log("Joined room", room, userId);

            // making call to other peers in the room
            const otherUsers = room.userIds || [];
            console.log("otherUsers", otherUsers);

            /**
             * Using Agora
             */

            // remove my user id from the list
            const myUserIndex = otherUsers.findIndex(id => id === userId);
            otherUsers.splice(myUserIndex, 1);
            console.log("otherUsers remove myUserId", otherUsers);

            await agoraClient.callToRemoteUsers(room.channelName, room.channelToken, otherUsers, id);

            // Toast.info('You joined the room.');
            showMessage({
                type: "success",
                value: "You joined the room."
            })
            Log.info('join_room_success', id);
            Log.verbose('Joined room, room info: ', room);

            if (!users.length)
                CallHistoryService.add({
                    startTime: +new Date(),
                    type: callHistoryType.startingNewCall,
                })
            else {
                CallHistoryService.add({
                    startTime: +new Date(),
                    type: callHistoryType.joiningExistedRoom,
                    users,
                })
            }
        } catch (e) {
            http.post('api/room/leave');
            Log.critical(`join_room_failed, room = ${room.id}, reason: ${e.message}`);
            // Toast.error('Couldn\'t join the room. Please try again.');
            showMessage({
                type: "error",
                value: "Couldn\'t join the room. Please try again.",
            })
        }
    }

    const isTalking = (roomData) => {
        return roomData.userIds.length > 1;
    }

    if (!id) return null

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {
                    isTalking(room)
                    &&
                    <div className={styles.talking}>
                        <span className={styles.talkingAnimation}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <span>Talking</span>
                    </div>
                }

                <div className={styles.users}>
                    {
                        displayedUsers.map((usr, ix) =>
                            <UserComponent
                                data={usr}
                                key={usr.id || ix}
                            />
                        )
                    }

                    {
                        !!remainingUsersCount
                        &&
                        <div className={styles.remainingUsers}>
                            +{remainingUsersCount} other(s)
                        </div>
                    }
                </div>

                <div className={styles.actions}>
                    <Button className={styles.button} onClickAsync={handleJoinRoom}>
                        Join
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Room