import React from 'react';
import { cx, getNameFromEmail } from '../../helper/utils';
import http from '../../services/http';
import { logService } from '../../services/log';
import { showNotification } from '../../services/notification';
import { playNotificationSound } from '../../services/sound';
// import { Toast } from '../../services/toast';
import { Button } from '../core/Button';
import MicrophoneManager from '../Main/Tools/Microphone';
import ScreenSharing from '../Main/Tools/ScreenSharing';
import leaveIcon from '../../resources/images/leave-ic.svg';
import tutorialIcon from '../../resources/images/tutorial-icon.png';
import styles from './styles.module.scss';

export const ActiveRoom = ({ agoraClient, currentRoom, showMessage }) => {
  const [focusOnMic, setFocusOnMic] = React.useState(false);
  const [turnOffPlaySound, setTurnOffPlaySound] = React.useState(() => {});
  const [isRinging, setIsRinging] = React.useState(false);
  let Log = logService.createLog("Room", { logToServer: true });
  const prevRoomRef = React.useRef();
  const isCalling = currentRoom && currentRoom.isGroup;

  React.useEffect(() => {
    Log = currentRoom && logService.createLog("Room", { logToServer: true, roomId: currentRoom.id });
    const prevRoom = prevRoomRef.current;
    if (prevRoom && currentRoom) {
      // check for new member join the room
      const memberJoinRoom = currentRoom.userNames.filter(userName => !prevRoom.userNames.includes(userName));
      if (memberJoinRoom && memberJoinRoom.length) {
        Log.info('member joins the room', memberJoinRoom);

        // Toast.info(`${memberJoinRoom.join(', ')} joined the room`);
        showMessage({
          type: "success",
          value: `${memberJoinRoom.join(', ')} joined the room.`
        })

        // notify if receive a new call
        if (prevRoom.userNames.length === 1 && currentRoom.id === prevRoom.id) {
          Log.info('received new call, notify me!');
          showNotification('Jam now', `${memberJoinRoom.join(', ')} want to talk with you`);
          agoraClient.setMicrophone(false);
          setFocusOnMic(true);
          setIsRinging(true);
          playNotificationSound({ repeatInterval: 1500 })
            .then(turnoff => setTurnOffPlaySound(() => () => {
              setIsRinging(false);
              turnoff();
            }));
        }
      }

      // check for member leave the room
      const memberLeaveRoom = prevRoom.userNames.filter(userName => !currentRoom.userNames.includes(userName));
      Log.info('member leaves the room', memberLeaveRoom);
      if (memberLeaveRoom && memberLeaveRoom.length) {
        // Toast.info(`${memberLeaveRoom.join(', ')} left the room`);
        showMessage({
          type: "warning",
          value: `${memberLeaveRoom.join(', ')} left the room`,
        })

        if (currentRoom.userNames.length === 1) {
          setFocusOnMic(false);
        }
      }
    }
    prevRoomRef.current = currentRoom;
  }, [currentRoom]);

  const turnOffNotificationSound = () => {
    if (typeof turnOffPlaySound === 'function') {
      turnOffPlaySound();
    }
  }

  const turnOffNotificationSoundOnLayoutFocus = () => {
    if (isRinging && typeof turnOffPlaySound === 'function') {
      turnOffPlaySound();
    }
  }

  agoraClient.onConnectionStateChange((state) => {
    // turn off calling sound if there has no connection
    if (state === 'DISCONNECTED') {
      turnOffNotificationSound();
    }
  });

  const onMicChange = micStatus => {
    isCalling && setFocusOnMic(!micStatus);
  }

  const handleLeaveRoom = async () => {
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
      Log.info(`leave_room_success, roomID: ${currentRoom.id}`);
    } catch (e) {
      // Toast.error('Couldn\'t leave the room. Please try again.');
      showMessage({
          type: "error",
          value: "Couldn\'t leave the room. Please try again."
      })
      Log.error(`leave_room_failed, room = ${currentRoom.id}`);
    }
  }

  return (
    <div className={cx(styles.container, isCalling && focusOnMic && styles.focusOnMic)} onClick={turnOffNotificationSoundOnLayoutFocus}>
      <div name='overlay' />
      <div className={styles.content}>
        <div className={cx(styles.microContainer, styles.contentItem, isCalling ? styles.calling : "")}>
          <MicrophoneManager onChange={onMicChange} agoraClient={agoraClient} showMessage={showMessage}/>
          {
            focusOnMic 
            &&
            <span className={styles.focusMicExplain}>
              <img src={tutorialIcon} />
              Click to turn Mic ON
            </span>
          }
        </div>

        <ScreenSharing
          className={cx(styles.contentItem, isRinging && styles.hidden)}
          disabled={!isCalling || isRinging}
          agoraClient={agoraClient} 
          showMessage={showMessage}
          onMicChange={onMicChange}
        />

        {
          isCalling && currentRoom && !!currentRoom.users.length
          &&
          <div className={cx(styles.roomInfo, styles.contentItem, isCalling && styles.display)}>
            <div className={styles.users}>
              {
                isCalling && currentRoom.users.map(user => (
                  <div key={user.id} className={styles.user}>{getNameFromEmail(user.email)}</div>
                ))
              }
            </div>

            <div className={styles.leaveRoomWrapper}>
              <Button onClickAsync={handleLeaveRoom} className={styles.leaveRoomBtn}>
                Leave
                <img src={leaveIcon} />
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  );
}