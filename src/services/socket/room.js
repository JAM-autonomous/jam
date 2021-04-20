import { BaseSocket } from './socket';
import CONFIG from '../../config/config';
import { logService } from '../log';

const Log = logService.createLog("Room Socket");

const EVENTS = {
  listroom: 'listroom'
};

class RoomSocket extends BaseSocket {
  constructor() {
    super('room-management', CONFIG.SOCKET_SERVER, CONFIG.SOCKET_SERVER_PATH);
    this.events = {};
  }

  onListRoom(callback) {
    this.events[EVENTS.listroom] = callback;
  }
  
  listen() {
    this.socket.on('listroom', rooms => {
      Log.info('Got new list room', rooms);
      this._callEvent(EVENTS.listroom, rooms);
    });
  }
}

export const roomSocket = new RoomSocket();
