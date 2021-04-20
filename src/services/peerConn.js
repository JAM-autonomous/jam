
export class PeerConnectionWrapper {
  constructor(remoteUserId, peerConn, remoteStream, status) {
    this.remoteUserId = remoteUserId;
    this.peerConn = peerConn;
    this.remoteStream = remoteStream;
    this.status = status;
  }
}