import React from "react"
import styles from "./styles.module.scss"
import MicOffIcon from "../../../../resources/images/mic-off-ic.svg"
import SpeakerIcon from "../../../../resources/images/speaker-ic.svg"
import SpeakerIconActive from "../../../../resources/images/speaker-ic-active.svg"
import { cx } from "../../../../helper/utils"

//global constants
const MINIMUM_VOLUMN_LEVEL_AS_SPEAKING = 3

const UserInRoom = ({ name, id, agoraUserId, agoraClient, auth }) => {
	const [muted, setMuted] = React.useState(id===auth.id ? !agoraClient.microphone : false)
	const [speaking, setSpeaking] = React.useState(false)

	React.useEffect(() => {
		agoraClient.onMicrophoneUpdate(status => {
			if(id === auth.id){
				setMuted(!status)
			}
		})
	}, [])

	React.useEffect(() => {
		if(agoraUserId){
			agoraClient.onUserInfoUpdated(micData => {
				if(micData.agoraUserId === agoraUserId){
					setMuted(micData.status === "muted")
				}
			})

			agoraClient.onVolumeIndicatorChange(volumnData => {
				const itemMatchWithAgoraUserId = volumnData.find(o => o.uid === agoraUserId)

				if(itemMatchWithAgoraUserId && itemMatchWithAgoraUserId.level >= MINIMUM_VOLUMN_LEVEL_AS_SPEAKING){
					setSpeaking(true)
				} else {
					setSpeaking(false)
				}
			})
		}
	}, [agoraUserId])

    return (
        <div className={cx(styles.container, speaking && styles.isSpeaking, muted && styles.isMuted)}>
			<span className={styles.name}>{name}</span>

			{
				!!muted
				?
				<span className={styles.mic}>
					<img src={MicOffIcon} />
				</span>
				:
				<span className={styles.mic}>
					<img src={speaking ? SpeakerIconActive : SpeakerIcon} />
				</span>
			}

			{
				!!speaking
				&&	
				<div className={styles.speaking}>
					<div />
					<div />
				</div>
			}
		</div>
    )
}

export default UserInRoom