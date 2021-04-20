import React from "react"
import styles from "./styles.module.scss"
import { showInviteModal } from '../../../../Invite/InviteModal';
import { aaTrack } from '../../../../../services/tracking';
import { TRACK_DEFINE } from '../../../../../services/tracking/define';

//resources
import InviteFriendIcon from "../../../../../resources/images/add-user.svg"

const InviteFriend = () => {
    return (
        <div className={styles.container} onClick={() => {
        	aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_INVITE_FROM_LISTROOM)
		    showInviteModal()
        }}>
			<div className={styles.wrapper}>
				<div className={styles.icon}>
					<img src={InviteFriendIcon} />
				</div>

				<span>Invite friend</span>
			</div>
		</div>
    )
}

export default InviteFriend