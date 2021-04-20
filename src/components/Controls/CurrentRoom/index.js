import React from "react"
import styles from "./styles.module.scss"
import { getNameFromEmail } from "../../../helper/utils"
import http from '../../../services/http'
import { logService } from '../../../services/log'

//resources
import LeaveIcon from '../../../resources/images/leave-ic.svg'

//components
import UserInRoom from "./UserInRoom"
import { Button } from '../../core/Button'

const CurrentRoom = ({ data, agoraClient, showMessage, auth }) => {
    const handleLeaveRoom = async () => {
    	const Log = data && logService.createLog("Room", { logToServer: true, roomId: data.id });

        try {
            /**
             * Using Agora
             */
            agoraClient.stop();
            await http.post('api/room/leave');
            // Toast.info('You left the room.');
            showMessage({
                type: "warning",
                value: "You left the room."
            })
            Log.info(`leave_room_success, roomID: ${data.id}`);
        } catch (e) {
            // Toast.error('Couldn\'t leave the room. Please try again.');
            showMessage({
                type: "error",
                value: "Couldn\'t leave the room. Please try again."
            })
            Log.error(`leave_room_failed, room = ${data.id}`);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.users}>
                {
                    data.users.map(usr =>
                        <UserInRoom 
                            key={usr.id}
                            name={getNameFromEmail(usr.email)}
                            id={usr.id}
                            agoraUserId={usr.agoraUserId}
                            agoraClient={agoraClient}
                            auth={auth}
                        />
                    )
                }
            </div>

            <div className={styles.action}>
              <Button onClickAsync={handleLeaveRoom} className={styles.button}>
                <img src={LeaveIcon} />
                Leave
              </Button>
            </div>
		</div>
    )
}

export default CurrentRoom