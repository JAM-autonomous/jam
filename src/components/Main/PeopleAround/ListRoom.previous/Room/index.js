import React from 'react';
import { aaTrack } from '../../../../../services/tracking';
import { TRACK_DEFINE } from '../../../../../services/tracking/define';
import http from '../../../../../services/http';
import { logService } from '../../../../../services/log';
// import { Toast } from '../../../../../services/toast';
import { Button } from '../../../../core/Button';
import LeaveIcon from './/../../../../../resources/images/leave-icon.png';
import Member from './Member';
import styles from './styles.module.scss';

export default function Room({ room, auth, agoraClient, messageQueueManager, isCurrentUserTalking, showMessage }) {
  const Log = logService.createLog("Room", { logToServer: true, roomId: room.id });
  const { id, users } = room || {};
  const { id: userId } = auth;

  if (!id) return null;

  const isInRoom = room.userIds.includes(userId);
  const oneMemberRoom = room.userIds.length === 1;

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

      await agoraClient.callToRemoteUsers(room.channelName, room.channelToken, otherUsers);

      // Toast.info('You joined the room.');
      showMessage({
        type: "success",
        value: "You joined the room."
      })
      Log.info('join_room_success', id);
      Log.verbose('Joined room, room info: ', room);
    } catch (e) {
      http.post('api/room/leave');
      Log.error(`join_room_failed, room = ${room.id}, reason: ${e.message}`);
      // Toast.error('Couldn\'t join the room. Please try again.');
      showMessage({
        type: "error",
        value: "Couldn\'t join the room. Please try again.",
      })
    }
  }

  const handleLeaveRoom = async (agoraClient) => {
    try {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_LEAVE);
      /**
       * Using Agora
       */
      agoraClient.stop();
      await http.post('api/room/leave');
      // Toast.info('You left the room');
      showMessage({
        type: "warning",
        value: "You left the room",
      })
      Log.info(`leave_room_success, roomID: ${room.id}`);
    } catch (e) {
      // Toast.error('Couldn\'t leave the room. Please try again.');
      showMessage({
        type: "error",
        value: "Couldn\'t join the room. Please try again.",
      })
      Log.error(`leave_room_failed, room = ${room.id}`);
    }
  }

  const isTalking = (roomData) => {
    return roomData.userIds.length > 1;
  }

  const isUserRoom = (roomData) => {
    return roomData.userIds.includes(auth.id);
  }

  const showRedOval = (roomData) => {
    return isUserRoom(roomData);
  }

  const showGreenOval = (roomData) => {
    return isTalking(roomData);
  }

  const userDisplayLimit = 3;

  const renderMember = () => {
    const renderUsers = users;
    return (
      <>
        { renderUsers.map((user, idx) => user && <Member messageQueueManager={messageQueueManager} userDisplayLimit={userDisplayLimit} key={user.id} index={idx} user={user} room={room} auth={auth} />)}
        { renderUsers.length > userDisplayLimit ? <div className={styles.more}>+{renderUsers.length - userDisplayLimit} others</div> : null}
      </>
    )
  }

  const roomHasOneUser = room.userIds.length === 1;
  const isCurrentUserRoom = room.userIds.includes(auth.id);
  const isOneUserRoomAndIsCurrentUserRoom = roomHasOneUser && isCurrentUserRoom;

  if (isOneUserRoomAndIsCurrentUserRoom) {
    return "";
  }

  const roomStatus = room.status;
  Log.info('roomStatus ', roomStatus);

  const handleInactive = () => {
    alert('Calling someone who is away feature is coming soon');
  }

  return (
    <div className={styles.container}>
      {  isTalking(room) ? 
      <div className={`${styles.talking} ${isCurrentUserTalking ? styles.currentUserTalking : ''}`}>
          Talking...
      </div>
      :  '' }
       
      <div className={`${styles.roomWrapper} ${isCurrentUserTalking ? styles.currentUserTalking : ''}`}>
        <div className={styles.detail}>
          <div className={styles.members}>
            { renderMember()}
          </div>

          <div className={styles.actions}>
            {
                isInRoom
                  ? (oneMemberRoom ? 
                  <button className="">.</button>
                  :
                  <Button className={styles.leaveButton} onClickAsync={() => handleLeaveRoom(agoraClient)}>
                    <img src={LeaveIcon} />
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;Leave</span>
                  </Button>
                  )
                  : 
                  (roomStatus === "inactive" ?
                  <Button className={styles.button} onClickAsync={handleInactive}>Away</Button>
                  :
                    <Button className={styles.joinButton} onClickAsync={handleJoinRoom}>Join</Button>
                  )
              }
          </div>
        </div>
      </div>
    </div>
  );
}