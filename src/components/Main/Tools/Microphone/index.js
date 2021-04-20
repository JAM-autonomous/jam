import React from 'react';
import Tool from '../Tool';
import MicOnIcon from '../../../../resources/images/mic-on-ic.svg';
import MicOffIcon from '../../../../resources/images/mic-off-ic.svg';
import styles from './styles.module.scss';
import { logService } from '../../../../services/log';
import { cx } from '../../../../helper/utils';
import { aaTrack } from '../../../../services/tracking';
import { ACTION_PARAMS, TRACK_DEFINE } from '../../../../services/tracking/define';
// import { Toast } from '../../../../services/toast';

const Log = logService.createLog('MicrophoneManager', { logToServer: true });

function MicrophoneManager({ className, onChange, agoraClient }) {
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

  return  (
    <div className={cx(styles.container, className)} onClick={toggle}>
       { microphone ?
        <Tool imageSrc={MicOnIcon} imageContainerClassName={styles.imgContainerOn}>
          <span className={styles.micro}>Mic: </span>
          <span className={styles.on}>ON</span>
        </Tool>
        : 
        <Tool imageSrc={MicOffIcon} imageContainerClassName={styles.imgContainerOff}>
        <span className={styles.micro}>Mic: </span>
        <span className={styles.off}>OFF</span>
      </Tool>
        } 
     
    </div>
  )
}

export default MicrophoneManager;