import React from "react"
import styles from "./styles.module.scss"

//components
import InviteFriend from "./InviteFriend"
import Room from "./Room"
import { NoRoom } from "../../../NoRoom"

const RoomList = ({ listRoom, auth, agoraClient, keyword = '', messageQueueManager, showMessage }) => {
    const getRooms = () => {
        return [
            ...listRoom.filter(r => !r.isYourRoom && r && r.search.includes(keyword))
        ]
    }

    const rooms = getRooms();

    return (
        !rooms.length ?
        <NoRoom
		    className={styles.noRoom}
		    text={keyword ? 'The person you’re looking for isn’t on Jam right now.' : 'There isn’t anyone else here at the moment.'} 
		    inviteText={keyword ? 'Invite them.': 'Invite your team.'}
		/> :
        <div className={styles.container}>
			<InviteFriend />

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
    )
}

export default RoomList