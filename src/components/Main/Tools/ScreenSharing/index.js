import React from 'react';
import { Button } from '../../../core/Button';
import Tool from '../Tool';
import ScreenSharingIcon from '../../../../resources/images/screen-sharing.svg';
import styles from './styles.module.scss';
// import { Toast } from '../../../../services/toast';
import { logService } from '../../../../services/log';
import { cx } from '../../../../helper/utils';
import { aaTrack } from '../../../../services/tracking';
import { ACTION_PARAMS, TRACK_DEFINE } from '../../../../services/tracking/define';

//resources
import closeIcon from '../../../../resources/images/close-ic.svg';
import micOnIcon from '../../../../resources/images/mic-on-ic.svg';
import micOffIcon from '../../../../resources/images/mic-off-ic.svg';

const Log = logService.createLog('ScreenSharing');

function ScreenSharing({ agoraClient, disabled, className, showMessage, onMicChange }) {
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [remoteTrack, setRemoteTrack] = React.useState();
  const [microphone, setMicrophone] = React.useState(agoraClient.microphone);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const videoTrackRef = React.useRef();

  React.useEffect(() => {
    agoraClient.onReceiveVideoTrack(track => {
      setRemoteTrack(track);
      track.play(videoTrackRef.current);
      toggleFullScreen(true);
    });

    agoraClient.onRemoveVideoTrack(() => setRemoteTrack(null));

    agoraClient.onMicrophoneUpdate(setMicrophone);

    agoraClient.onConnectionStateChange(state => {
      if (state === 'DISCONNECTED') {
        setRemoteTrack(null);
        setIsScreenSharing(false);
      }
    });
  }, []);

  const toggleScreenSharing = async () => {
    try {
      const setting = !isScreenSharing;
      setIsScreenSharing(setting);
  
      if (setting) {
        aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN, [ACTION_PARAMS.TURN_ON]);
        return await agoraClient.startScreenSharing();
      }
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN, [ACTION_PARAMS.TURN_OFF]);
      return await agoraClient.endScreenSharing();
    } catch (e) {
      setIsScreenSharing(false);
    }
  }

  const onClick = () => {
    if (disabled) {
      // Toast.warning('Join or start a conversation to share your screen.');
      showMessage({
        type: "warning",
        value: "Please join or start a conversation to share your screen."
      })
    } else {
      return toggleScreenSharing();
    }
  }

  const toggleFullScreen = (isAuto) => {
    const setting = !isFullScreen;
    setIsFullScreen(setting);

    if (setting) {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN_FULLSCREEN, [
        ACTION_PARAMS.OPEN,
        ...isAuto ? [] : [ACTION_PARAMS.AUTO]
      ]);
    } else {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN_FULLSCREEN, [
        ACTION_PARAMS.CLOSE,
        ...isAuto ? [] : [ACTION_PARAMS.AUTO]
      ]);
    }
  }

  const toggleMicrophone = () => {
    const setting = !microphone;
    agoraClient.setMicrophone(setting);
    setMicrophone(setting);
    onMicChange && onMicChange(setting);

    if (setting) {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN_MIC, [ACTION_PARAMS.TURN_ON]);
    } else {
      aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN_MIC, [ACTION_PARAMS.TURN_OFF]);
    }
  }

  return  (
    <div className={cx(styles.container, className)}>
      {
        remoteTrack
          ? (
            <Tool
              onClick={isFullScreen ? null : toggleFullScreen}
              containerClassname={remoteTrack && styles.hasTrack}
              childrenComponent={
                <div ref={videoTrackRef} className={cx(styles.videoView, isFullScreen && styles.videoFullscreen)}>
                  { isFullScreen && (
                    <div className={styles.fullScreenControlBar}>
                      <div className={styles.btnGroup}>
                        <Button className={cx(styles.btn, styles.closeBtn)} onClick={toggleFullScreen}>
                          <div>
                            <img src={closeIcon} />
                          </div>
                          Close
                        </Button>

                        <Button className={cx(styles.btn, styles.micBtn)} onClick={toggleMicrophone}>
                          {
                            microphone
                            ?
                            <React.Fragment>
                                <div>
                                  <img src={micOnIcon} />
                                </div>

                                Mic: <span className={styles.onLabel}>ON</span>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <div>
                                  <img src={micOffIcon} />
                                </div>

                                Mic: <span className={styles.offLabel}>OFF</span>
                            </React.Fragment>
                          }
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          )
          : (
            <Tool onClick={onClick} disabled={disabled} imageSrc={ScreenSharingIcon}>
              {isScreenSharing ? "Stop" : "Share screen"}
            </Tool>
          )
      }
      
    </div>
  )
}

export default ScreenSharing;