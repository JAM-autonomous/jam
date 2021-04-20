import React from "react"
import styles from "./styles.module.scss"
import { logService } from '../../../services/log';
import { aaTrack } from '../../../services/tracking';
import { ACTION_PARAMS, TRACK_DEFINE } from '../../../services/tracking/define';
import { cx } from "../../../helper/utils"

//resources
import MicOnIcon from "../../../resources/images/mic-on-ic.svg"
import MicOffIcon from "../../../resources/images/mic-off-ic.svg"

//global contants
const Log = logService.createLog('MicrophoneManager', { logToServer: true });

const Mic = ({ onChange, agoraClient }) => {
    const [microphone, setMicrophone] = React.useState(agoraClient.microphone);

    const toggle = () => {
        const setting = !microphone;
        agoraClient.setMicrophone(setting);
        setMicrophone(setting);

        if (typeof onChange === 'function') {
            onChange(setting);
        }

        if (setting) {
            Log.info('change_microphone_on');
            aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_MIC, [ACTION_PARAMS.TURN_ON]);
        } else {
            Log.info('change_microphone_off');
            aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_MIC, [ACTION_PARAMS.TURN_OFF]);
        }
    }

    agoraClient.onMicrophoneUpdate(setMicrophone);

    return (
        <div className={cx(styles.container, !microphone && styles.micOff)}>
			<button className={styles.wrapper} onClick={toggle}>
				<div className={styles.icon}>
					<img src={microphone ? MicOnIcon : MicOffIcon} />
				</div>
				<div className={styles.label}>
					Mic: <span>{microphone ? "ON" : "OFF"}</span>
				</div>
			</button>
		</div>
    )
}

export default Mic