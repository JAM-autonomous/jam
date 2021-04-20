import Room from './Room';
import { NoRoom } from '../../../NoRoom';
import styles from './styles.module.scss';
import { logService } from '../../../../services/log';
import { getNameFromEmail } from '../../../../helper/utils';
import InviteFriendTool from '../../Tools/InviteFriendTool';

const Log = logService.createLog("ListRoom");

export default function ListRoom({ listRoom, auth, agoraClient, keyword = '', messageQueueManager, showMessage }) {
  const getRooms = () => {
    return [
      // userRoom,
      ...listRoom.filter(r => !r.isYourRoom && r && r.search.includes(keyword))
    ]
  }

  const rooms = getRooms();

  if (rooms.length) {
    return (
      <div className={styles.container}>
        <InviteFriendTool />
        {
          rooms.map(room => room?.isGroup && room?.isYourRoom
            ? null
            : (
              <Room key={room.id} 
                messageQueueManager={messageQueueManager}
                showMessage={showMessage}
                room={{
                ...room,
              }} auth={auth} agoraClient={agoraClient}/>
            )
          )
        }
      </div>
    );
  }

  return (
    <NoRoom
      className={styles.noRoom}
      text={keyword ? 'The person you’re looking for isn’t on Jam right now.' : 'There isn’t anyone else here at the moment.'} 
      inviteText={keyword ? 'Invite them.': 'Invite your team.'}
    />
  );
}