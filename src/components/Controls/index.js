import React from "react"
import styles from "./styles.module.scss"
import { logService } from "../../services/log"
import { showNotification } from "../../services/notification"
import { playNotificationSound } from "../../services/sound"
import { capitalizeFirstLetter } from "../../helper/utils"
import CallHistoryService, { callHistoryType } from "../../services/callHistory"

//components
import Mic from "./Mic"
import ShareScreen from "./ShareScreen"
import CurrentRoom from "./CurrentRoom"

//resources
import TutorialIcon from "../../resources/images/tutorial-ic.svg"

const Controls = ({ agoraClient, currentRoom, showMessage, auth }) => {
    const [focusOnMic, setFocusOnMic] = React.useState(false);
    const [turnOffPlaySound, setTurnOffPlaySound] = React.useState(() => {});
    const [isRinging, setIsRinging] = React.useState(false);
    let Log = logService.createLog("Room", { logToServer: true });
    const prevRoomRef = React.useRef();
    const isCalling = currentRoom && currentRoom.isGroup;

    let _ringing = isRinging

    React.useEffect(() => {
        _ringing = isRinging
    }, [isRinging])

    React.useEffect(() => {
        Log = currentRoom && logService.createLog("Room", { logToServer: true, roomId: currentRoom.id });
        const prevRoom = prevRoomRef.current;
        if (prevRoom && currentRoom) {
            // check for new member join the room
            const memberJoinRoom = currentRoom.userNames.filter(userName => !prevRoom.userNames.includes(userName));
            if (memberJoinRoom && memberJoinRoom.length) {
                Log.info("member joins the room", memberJoinRoom);

                // Toast.info(`${memberJoinRoom.join(", ")} joined the room`);
                showMessage({
                    type: "success",
                    value: `${memberJoinRoom.map(o => capitalizeFirstLetter(o)).join(", ")} joined the room.`,
                    withSound: true,
                })

                CallHistoryService.addUsersToTheCurrentCall(
                    currentRoom.users.filter(o => o.id !== auth.id)
                )

                // notify if receive a new call
                if (prevRoom.userNames.length === 1 && currentRoom.id === prevRoom.id) {
                    Log.info("received new call, notify me!");
                    showNotification("Jam now", `${memberJoinRoom.join(", ")} want to talk with you`);
                    agoraClient.setMicrophone(false);
                    setFocusOnMic(true);
                    setIsRinging(true);
                    playNotificationSound({ repeatInterval: 1500 })
                        .then(turnoff => setTurnOffPlaySound(() => () => {
                            setIsRinging(false);
                            turnoff();
                        }));

                    CallHistoryService.add({
                        users: (currentRoom.users || []).filter(o => o.id !== auth.id),
                        type: callHistoryType.incomingCall,
                    })
                }
            }

            // check for member leave the room
            const memberLeaveRoom = prevRoom.userNames.filter(userName => !currentRoom.userNames.includes(userName));
            Log.info("member leaves the room", memberLeaveRoom);
            if (memberLeaveRoom && memberLeaveRoom.length) {
                // Toast.info(`${memberLeaveRoom.join(", ")} left the room`);
                showMessage({
                    type: "warning",
                    value: `${memberLeaveRoom.map(o => capitalizeFirstLetter(o)).join(", ")} left the room`,
                    withSound: true,
                })

                if (currentRoom.userNames.length === 1) {
                    setFocusOnMic(false);
                }


                //If all memebers leaf room and still ringing -> Update type of the last call to 'missingCall'
                if(!currentRoom.users.filter(o => o.id !== auth.id).length && _ringing){
                    CallHistoryService.updateTypeOfTheCurrentCall(callHistoryType.missingCall)
                    CallHistoryService.triggerOnHasMissedCall()
                }
            }
        }
        prevRoomRef.current = currentRoom;
    }, [currentRoom]);

    const turnOffNotificationSound = () => {
        if (typeof turnOffPlaySound === "function") {
            turnOffPlaySound();
        }
    }

    const turnOffNotificationSoundOnLayoutFocus = () => {
        if (isRinging && typeof turnOffPlaySound === "function") {
            turnOffPlaySound();
        }
    }

    agoraClient.onConnectionStateChange((state) => {
        // turn off calling sound if there has no connection
        if (state === "DISCONNECTED") {
            turnOffNotificationSound();
        }
    });

    const onMicChange = micStatus => {
        isCalling && setFocusOnMic(!micStatus);
    }

    return (
        <React.Fragment>
            <div className={styles.container} onClick={turnOffNotificationSoundOnLayoutFocus}>
                <Mic
                    onChange={onMicChange}
                    agoraClient={agoraClient}
                    showMessage={showMessage}
                />
                <ShareScreen
                    isRinging={isRinging}
                    disabled={!isCalling}
                    agoraClient={agoraClient} 
                    showMessage={showMessage}
                    onMicChange={onMicChange}
                />

    			{
    				isCalling &&
    				currentRoom && 
    				!!currentRoom.users.length &&
    				<CurrentRoom
    					agoraClient={agoraClient}
    					data={currentRoom}
    					showMessage={showMessage}
                        auth={auth}
    				/>
    			}

                {
                    focusOnMic
                    &&
                    <div className={styles.tutorial}>
                        <img src={TutorialIcon} />
                        <span>Click to turn Mic on</span>
                    </div>
                }
            </div>
            {
                focusOnMic
                &&
                <div className="app-overlay" onClick={turnOffNotificationSoundOnLayoutFocus}></div>
            }
        </React.Fragment>
    )
}

export default Controls