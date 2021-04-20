import React from "react"
import styles from "./styles.module.scss"
import { cx } from "../../../helper/utils"
import { logService } from '../../../services/log'
import { aaTrack } from '../../../services/tracking'
import { ACTION_PARAMS, TRACK_DEFINE } from '../../../services/tracking/define'

//components
import { Button } from "../../core/Button"

//resources
import ShareScreenIcon from "../../../resources/images/screen-sharing.svg"
import closeIcon from '../../../resources/images/close-ic.svg'
import micOnIcon from '../../../resources/images/mic-on-ic.svg'
import micOffIcon from '../../../resources/images/mic-off-ic.svg'

const ShareScreen = ({ agoraClient, disabled, isRinging, showMessage, onMicChange }) => {
    const [isScreenSharing, setIsScreenSharing] = React.useState(false);
    const [remoteTrack, setRemoteTrack] = React.useState();
    const [microphone, setMicrophone] = React.useState(agoraClient.microphone);
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const videoTrackRef = React.useRef();

    const processShareScreenSource = src => {
        navigator.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: src.id,
                    }
                }
            },
            stream => {
                agoraClient.startScreenSharing(stream)
            },
            e => {
                console.log("Error when processShareScreenSource", e)
            }
        )
    }
    
    React.useEffect(() => {
        agoraClient.onSharingScreenStatusChange(setIsScreenSharing)

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
                const globalDataDOMElement = document.getElementById("global-data")
                const sources = JSON.parse(globalDataDOMElement.getAttribute("screen-sources"))

                if(!!sources.length)
                    return processShareScreenSource(sources[0])
            }
            aaTrack.trackEvent(TRACK_DEFINE.CLICK_BUTTON_SHARE_SCREEN, [ACTION_PARAMS.TURN_OFF]);
            return await agoraClient.endScreenSharing();
        } catch (e) {
            setIsScreenSharing(false);
        }
    }

    const handleClick = () => {
        if (!remoteTrack) handleSharing()
        else if (!isFullScreen) toggleFullScreen()
    }

    const handleSharing = () => {
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

    return (
        <React.Fragment>
	        <div className={cx(styles.container, disabled && styles.disabled, remoteTrack && styles.hasRemoteTrack)}>
	    		<button className={styles.wrapper} onClick={handleClick} id="share-screen-button">
	    			{
	    				remoteTrack
		        		?
		        		<div ref={videoTrackRef} className={cx(styles.video, isFullScreen && styles.fullScreen)}>
		        			{
		        				isFullScreen
		        				&&
		        				<div className={styles.controls}>
		        					<Button className={styles.close} onClick={toggleFullScreen}>
			                          	<div>
			                            	<img src={closeIcon} />
			                          	</div>
			                          	Close
			                        </Button>

			                        <Button className={styles.mic} onClick={toggleMicrophone}>
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
		        			}
		        		</div>
		        		:
		        		<React.Fragment>
		        			<div className={styles.icon}>
								<img src={ShareScreenIcon} />
							</div>
							<div className={styles.label}>
								{isScreenSharing ? "Stop sharing" : "Share screen"}
							</div>
		        		</React.Fragment>
	    			}
				</button>
			</div>
		</React.Fragment>
    )
}

export default ShareScreen