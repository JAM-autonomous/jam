import React, { useEffect } from 'react';
import AgoraClient from '../../services/agoraClient';
import authService from '../../services/auth';
// import { onForegroundMessage } from '../../services/notification';
import { roomSocket } from '../../services/socket/room';
import { signalSocket } from '../../services/socket/signal';
import styles from './styles.module.scss';
import MessageQ from '../../helper/messageq';
import { logService } from '../../services/log';
// import { ActiveRoom } from '../../components/ActiveRoom';
import { getNameFromEmail } from '../../helper/utils';
import { aaTrack } from '../../services/tracking';
import { PAGE_NAMES } from '../../services/tracking/define';

//components
import Controls from "../../components/Controls"
import Hello from '../../components/Main/Hello';
import PeopleAround from '../../components/Main/PeopleAround';
import {trollboxSocket} from "../../services/socket/trollbox";
import Trollbox from "../../components/Trollbox"

const Log = logService.createLog("Main");
aaTrack.trackPage(PAGE_NAMES.HOME);

function MainPage(props) {
  Log.info('main page renderer', new Date().getTime());
  const { showMessage } = props;
  const auth = authService.auth;
  const [listRoom, setListRoom] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');
  const [agoraClient, setAgoraClient] = React.useState(null);
  const [currentUserRoom, setCurrentUserRoom] = React.useState();

  const onListRoom = (newListRoom) => {
    const rooms = Object.values(newListRoom);
    const currentUserId = auth.id;

    Log.info('current user id', currentUserId);
    Log.verbose('receive rooms from server', [...rooms]);

    const listRoomWithData = rooms.map(room => {
      return {
        ...room,
        isYourRoom: room.userIds.includes(auth.id),
        isYourOneMemberRoom: room.isYourRoom && room.userIds.length === 1,
        isTwoMembersRoom: room.userIds.length === 2,
        isGroup: room.userIds.length > 1,
        isPersonalCall: room.isYourRoom && room.isTwoMembersRoom,
        userEmails: room.users.map(u => u.email),
        userNames: room.users.map(u => getNameFromEmail(u.email)),
        search: room.users.map(u => u.email).join(', '),
        users: room.users.map(u => ({
          ...u,
          agoraUserId: ((room.agoraInfo || []).find(item => item.userId == u.id) || {}).agoraUserId
        }))
      };
    });

    Log.verbose('rooms change ', listRoomWithData);
    if (listRoomWithData.length > 0) {
      const willCloseConnection = listRoomWithData.find(i => i.userIds.includes(auth.id) && i.userIds.length === 1);

      if (willCloseConnection) {
        Log.info('You are not in any group.');
        Log.info('Close any opened connection.');
        agoraClient.stop();
      }
    }

    setCurrentUserRoom(listRoomWithData.find(r => r.userIds.includes(auth.id)));
    setListRoom(listRoomWithData);
  }

  useEffect(() => {
    Log.info('init socket')
    // DO NOT DELETE IT
    roomSocket.init(auth);
    signalSocket.init(auth);
    trollboxSocket.init(auth);
    // <--- DO NOT DELETE IT

    /**
     * Using Agora
     */
    // Init AgoraClient
    setAgoraClient(new AgoraClient(auth.id, signalSocket.socket));

    Log.info('on list room');
    roomSocket.onListRoom(onListRoom);

    // onForegroundMessage !== null && onForegroundMessage(e => {
    //   Log.info('foreground notification ', e);
    // });
    return () => {

    }
  }, []);

  /**
   * Using Agora
   */
  useEffect(() => {
    Log.info('update on list room agoraClient');
    roomSocket.onListRoom(onListRoom);
  }, [agoraClient])

  if (auth === undefined || !agoraClient) {
    return null;
  }
  const messageQueueManager = new MessageQ();
  if (!messageQueueManager) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Hello auth={auth} />
      {/*<ActiveRoom agoraClient={agoraClient} currentRoom={currentUserRoom} auth={auth} showMessage={showMessage}/>*/}

      <Controls
        agoraClient={agoraClient}
        currentRoom={currentUserRoom}
        auth={auth}
        showMessage={showMessage}
      />

      <PeopleAround
        listRoom={listRoom}
        auth={auth}
        agoraClient={agoraClient}
        keyword={keyword}
        messageQueueManager={messageQueueManager}
        onSearchKeyword={setKeyword}
        showMessage={showMessage}
      />

      <Trollbox />
    </div>
  )
}

export default MainPage;
