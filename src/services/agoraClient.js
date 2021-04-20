import AgoraRTC from "agora-rtc-sdk-ng";
import http from "../services/http";
import { logService } from './log';
import config from '../config/config';
import { Toast } from "./toast";
import { debounce } from 'debounce';

const Log = logService.createLog('agoraClient', { logToServer: true });
AgoraRTC.setLogLevel(config.IS_PRODUCTION ? 3 : 0);

const clientConfig = {
    mode: "rtc",
    codec: "vp8",
}

const configAudio = {
    encoderConfig: "high_quality",
    AEC: true, // automatic echo cancellation
    AGC: true, // automatic gain control
    ANS: true, // automatic noise suppression
}

export default class AgoraClient {
    constructor(
        clientId,
        socketClient
    ) {
        try {
            this.clientId = clientId;
            this.socket = socketClient;
            this.clientAgora = AgoraRTC.createClient(clientConfig);
            this.localAudioTrack = null;
            this.localScreenTrack = null;
            this.microphone = true;
            this._onReceiveVideoTrackListener = [];
            this._onRemoveVideoTrackListener = [];
            this._onConnectionStateChangeListener = [];
            this._onMicrophoneUpdateListener = [];
            this._onSharingScreenStatusChangeListener = [];
            this._onUserInfoUpdatedListener = [];
            this._onVolumeIndicatorChangeListener = [];
            this.channelName = null;

            this.initSocketListener();
            this.clientAgora.on('connection-state-change', (state) => {
                this.triggerConnectionStateChange(state);
            });

            this.permissionOnchange();
            this.onMicrophoneChanged();

            Log.info('Init client, uid: ', this.clientAgora.uid);
        } catch (e) {
            Log.critical(`Init failed, clientId: ${clientId}, error: ${e.message}`);
            throw e;
        }
    }
    
    onMicrophoneChanged() {
        AgoraRTC.onMicrophoneChanged = async (info) => {
            const microphones = await AgoraRTC.getMicrophones(false);

            if (!microphones || microphones.length === 0) {
                return;
            }

            const defaultDevice = microphones.find((device) => device.deviceId === "default");

            if (defaultDevice && this.localAudioTrack) {
                this.localAudioTrack.setDevice(defaultDevice.deviceId);
            }
        }
    }

    permissionOnchange() {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {

                // PermissionState = "denied" | "granted" | "prompt";

                permissionStatus.onchange = () => {

                    // ChannelName is not null = Calling
                    if (!this.channelName) {
                        return;
                    }

                    (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') ?
                    this.createAndPublishAudioTrack(): this.destroyLocalAudioTrack();
                }
            });
        }
    }

    onMicrophoneUpdate(callback) {
        if (typeof callback === 'function') this._onMicrophoneUpdateListener.push(callback);
    }

    onSharingScreenStatusChange(callback) {
        if (typeof callback === 'function') this._onSharingScreenStatusChangeListener.push(callback);
    }

    onConnectionStateChange(callback) {
        if (typeof callback === 'function') this._onConnectionStateChangeListener.push(callback);
    }

    onReceiveVideoTrack(callback) {
        if (typeof callback === 'function') this._onReceiveVideoTrackListener.push(callback);
    }

    onRemoveVideoTrack(callback) {
        if (typeof callback === 'function') this._onRemoveVideoTrackListener.push(callback);
    }

    onUserInfoUpdated(callback) {
        if (typeof callback === 'function') this._onUserInfoUpdatedListener.push(callback);
    }

    onVolumeIndicatorChange(callback) {
        if (typeof callback === 'function') this._onVolumeIndicatorChangeListener.push(callback);
    }

    triggerMicrophoneUpdate(microphone) {
        this._onMicrophoneUpdateListener.forEach(callback => callback(microphone));
    }

    triggerReceiveVideoTrack(videoTrack) {
        this._onReceiveVideoTrackListener.forEach(callback => callback(videoTrack));
    }

    triggerRemoveVideoTrack() {
        this._onRemoveVideoTrackListener.forEach(callback => callback());
    }


    triggerConnectionStateChange(state) {
        this._onConnectionStateChangeListener.forEach(callback => callback(state));
    }

    triggerSharingScreenStateChange(status){
        this._onSharingScreenStatusChangeListener.forEach(callback => callback(status));
    }

    triggerUserInfoUpdated(data){
        this._onUserInfoUpdatedListener.forEach(callback => callback(data));
    }

    triggerVolumeIndicatorChange(data){
        this._onVolumeIndicatorChangeListener.forEach(callback => callback(data));
    }


    handleUserPublished = async (user, mediaType) => {
        try {
            Log.verbose("handleUserPublished -  Info", user, mediaType);
            // If the subscribed track is audio.
            if (mediaType === "audio" && user.hasAudio) {
                const remoteAudioTrack = await this.clientAgora.subscribe(user, mediaType);
                if (remoteAudioTrack) {
                    remoteAudioTrack.play();
                }
            }

            // If the subscribed track is video/screen sharing.
            if (mediaType === "video" && user.hasVideo) {
                const remoteVideoTrack = await this.clientAgora.subscribe(user, mediaType);
                if (remoteVideoTrack) {
                    this.triggerReceiveVideoTrack(remoteVideoTrack);
                }
            }
        } catch (e) {
            Log.error(`handleUserPublished failed, mediaType: ${mediaType}, uid: ${user && user.uid}, e: ${e.message}`);
            throw e;
        }
    }

    handleUserUnpublished = async (user, mediaType) => {
        try {
            Log.verbose("user-unpublished", user, mediaType);

            if (mediaType === 'video') {
                this.triggerRemoveVideoTrack();
            }

            await this.clientAgora.unsubscribe(user, mediaType);
        } catch (e) {
            Log.critical(`handleUserUnpublished failed, mediaType: ${mediaType}, e: ${e.message}`);
            throw e;
        }
    }

    handleException = async (event) => {
        const statsCall = await this.clientAgora.getRTCStats();
        Log.critical(`Agora exception with event: ${JSON.stringify(event)}, channelName: ${this.channelName}, statsCall: ${JSON.stringify(statsCall)}`);
    }

    handleNetworkQuality = (stats) => {
        // Rating = 3: Users experience slightly impaired communication. 
        if (stats.downlinkNetworkQuality >= 3) {
            Log.info(`downlinkNetworkQuality, channelName: ${this.channelName}, stats: ${stats.downlinkNetworkQuality}`);
        }

        if (stats.uplinkNetworkQuality >= 3) {
            Log.info(`uplinkNetworkQuality, channelName: ${this.channelName}, stats: ${stats.uplinkNetworkQuality}`);
        }
    }

    /*
    * uid: The ID of the remote user.
    * msg: "mute-audio" | "mute-video" | "enable-local-video" | "unmute-audio" | "unmute-video" | "disable-local-video"
    */
    handleUserInfoUpdated = (uid, msg) => {
      switch (msg) {
        case "mute-audio":
          this.triggerUserInfoUpdated({
            agoraUserId: uid,
            status: "muted"
          })
          break;
        case "unmute-audio":
          this.triggerUserInfoUpdated({
            agoraUserId: uid,
            status: "unmuted"
          })
          break;
      }
    }

    /*
    * Result: object[]
    * The volume is an integer ranging from 0 to 100. Usually a user with volume above five is a speaking user.
    */
    handleVolumeIndicator = (result) => {
      this.triggerVolumeIndicatorChange(result)
      // result.forEach((volume, index) => {
      //   console.log(`handleVolumeIndicator: ${index} UID ${volume.uid} Level ${volume.level}`);
      // });
    }

    async start(channelName, channelToken, roomId) {

        this.clientAgora.on("user-published", this.handleUserPublished);
        this.clientAgora.on("user-unpublished", this.handleUserUnpublished);
        this.clientAgora.enableAudioVolumeIndicator();

        const uid = await this.clientAgora.join(config.AGORA_CONFIG.appId, channelName, channelToken, null);

        if (!uid) {
            const error = `Cannot join channel: ${channelName}`;
            Log.critical(error);
            throw error;
        }

        this.channelName = channelName;

        Log.info(`join a room, channelName: ${channelName}, uid: ${uid}`);

        // Handle | exception | network quality | user info updated | after joining room
        this.clientAgora.on("exception", this.handleException);
        this.clientAgora.on("network-quality", this.handleNetworkQuality);
        this.clientAgora.on("user-info-updated", this.handleUserInfoUpdated);
        this.clientAgora.on("volume-indicator", this.handleVolumeIndicator);

        this.createAndPublishAudioTrack();
        this.updateAgoraUserId(roomId, uid);
    }

    async createAndPublishAudioTrack() {
        try {
            // Create an audio track from the audio sampled by a microphone
            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack(configAudio);

            if (this.microphone && this.localAudioTrack) {
                await this.clientAgora.publish(this.localAudioTrack);
            }
        } catch (e) {
            Log.critical(`CreateAndPublishAudioTrack failed, e: ${e.message}`);
            Toast.error("Microphone permission denied");
        }
    }

    async updateAgoraUserId(roomId, agoraUserId) {
      await http.post('api/room/agora-user-id', { roomId, agoraUserId });
      Log.info(`updateAgoraUserId, roomId: ${roomId}, agoraUserId: ${agoraUserId}`);
    }

    async stop() {
        try {
            // Destroy the local audio and track.
            await this.destroyLocalAudioTrack();

            // Destroy the local screen and track.
            if (this.localScreenTrack) {
                this.localScreenTrack.stop();
                this.localScreenTrack.close();
                await this.clientAgora.unpublish(this.localScreenTrack);
            }

            // Leave the channel.
            if (this.clientAgora) {
                await this.clientAgora.leave();
            }

            this.channelName = null;
            this.removeAllListeners();

        } catch (e) {
            Log.critical(`stop failed, e: ${e.message}`);
            throw e;
        }
    }

    async removeAllListeners() {
      this.clientAgora.removeAllListeners("user-published");
      this.clientAgora.removeAllListeners("user-unpublished");
      this.clientAgora.removeAllListeners("exception");
      this.clientAgora.removeAllListeners("network-quality");
      this.clientAgora.removeAllListeners("user-info-updated");
      this.clientAgora.removeAllListeners("volume-indicator");
    }

    async destroyLocalAudioTrack() {

        if (this.localAudioTrack) {
            this.localAudioTrack.stop();
            this.localAudioTrack.close();

            if (this.microphone) {
                await this.clientAgora.unpublish(this.localAudioTrack);
            }
        }
    }

    async startScreenSharing(stream) {
        try {
            if(!stream){
                const encoderConfig = "1080p_2";
                const withAudio = "disable";

                this.localScreenTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig }, withAudio);
                Log.verbose("screenTrack", this.localScreenTrack);

                if (this.localScreenTrack) {
                    this.localScreenTrack.on('track-ended', this.endScreenSharing.bind(this));
                    await this.clientAgora.publish(this.localScreenTrack);
                }
            } else {
                this.localScreenTrack = await AgoraRTC.createCustomVideoTrack({
                    mediaStreamTrack: stream.getVideoTracks()[0],
                })

                Log.verbose("screenTrack", this.localScreenTrack);

                if (this.localScreenTrack) {
                    this.localScreenTrack.on('track-ended', this.endScreenSharing.bind(this));
                    await this.clientAgora.publish(this.localScreenTrack);
                }
            }
        } catch (e) {
            Log.error(`startScreenSharing failed, e: ${e.message}`);
            throw e;
        }
    }

    async endScreenSharing() {
        this.triggerSharingScreenStateChange(false)

        try {
            if (this.localScreenTrack) {
                this.localScreenTrack.stop();
                this.localScreenTrack.close();
                this.clientAgora.unpublish(this.localScreenTrack);
            }
        } catch (e) {
            Log.error(`endScreenSharing failed, e: ${e.message}`);
            throw e;
        }
    }

    initSocketListener() {
        try {
            this.socket.on(this.clientId, async (response) => {
                switch (response.type) {
                    case 'offerInfo':
                        await this.onOfferReceive(response.fromUserId, response.message);
                        break;
                    case 'answerInfo':
                        // this.onAnswerReceive(response.fromUserId, response.message);
                        break;
                    case 'icecandidateInfo':
                        // this.onIceCandidateReceive(response.fromUserId, response.message);
                        break;
                }
            });
        } catch (e) {
            Log.critical(`initSocketListener failed, e: ${e.message}`);
            throw e;
        }
    }

    async callToRemoteUsers(channelName, channelToken, remoteUserIds, roomId) {
        Log.info(`callToRemoteUsers, channelName: ${channelName}, channelToken: ${channelToken}, remoteUserIds: ${JSON.stringify(remoteUserIds)}`);
        await this.start(channelName, channelToken, roomId);
        if (remoteUserIds instanceof Array && remoteUserIds.length === 1) {
            remoteUserIds.forEach(async (userId) => {
                this.connect(userId, channelName, channelToken, roomId);
            });
        }
    }

    connect(toUserId, channelName, channelToken, roomId) {
        try {
            this.socket.emit('offer', JSON.stringify({ toUserId, offerObj: { channelName, channelToken, roomId } }));
        } catch (e) {
            Log.critical(`connect failed, e: ${e.message}`);
            throw e;
        }
    }

    async onOfferReceive(fromUserId, offer) {
        Log.info(`AgoraClient onOfferReceive ${fromUserId}`);
        if (!offer) {
            return;
        }

        await this.start(offer.channelName, offer.channelToken, offer.roomId);
    }

    setMicrophone = debounce(async (microphone) => {
        try {

            this.microphone = microphone;

            // Create an audio track from the audio sampled by a microphone
            if (!this.localAudioTrack) {
                this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack(configAudio);
            }

            // if mic is updated while calling, need to publish/unpublish the audio track
            if (this.clientAgora.connectionState === 'CONNECTED' && this.localAudioTrack) {
                microphone ? await this.clientAgora.publish(this.localAudioTrack) : await this.clientAgora.unpublish(this.localAudioTrack);
            }

            this.triggerMicrophoneUpdate(microphone);
        } catch (e) {
            Log.critical(`setMicrophone failed, e: ${e.message}`);
            throw e;
        }
    }, 500)
}