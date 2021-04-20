import { BaseSocket } from './socket';
import CONFIG from '../../config/config';
import { logService } from '../log';

const Log = logService.createLog("Signal Socket");

class SignalSocket extends BaseSocket {
  constructor() {
    super('signal-management', CONFIG.SOCKET_SERVER, CONFIG.SOCKET_SERVER_PATH);
  }

  listen() {
    this.socket.on(this.userId, (data) => {
      Log.info('[SIGNAL data]', data);
    });

    window.emit = (id, data) => this.socket.emit('exchange', { id, data });
  }
}

export const signalSocket = new SignalSocket();