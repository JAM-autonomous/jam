import {BaseSocket} from './socket';
import CONFIG from '../../config/config';
import {logService} from '../log';
import React from "react";

const Log = logService.createLog("TrollBox Socket");


const EVENTS = {
  firstData: 'firstData',
  updateData: 'updateData'
};

class TrollBox extends BaseSocket {
  constructor() {
    super('trollbox', CONFIG.SOCKET_SERVER, CONFIG.SOCKET_SERVER_PATH);
    this.events = {};
    this.auth = null;
  }

  init(auth) {
    this.auth = auth;

    this.listen();
  }

  sendMessage(message) {

    this.socket.emit('postMessage', {
      'message': message
    })
  }

  onFirstData(callback) {
    this.events[EVENTS.firstData] = callback
  }

  onUpdateData(callback) {
    this.events[EVENTS.updateData] = callback
  }

  listen() {
    // Send message with sendMessage function above

    this.socket.on(this.auth.id, resp => {
      if (resp && resp.command === 'last100messages' && resp.status) {
        console.log(resp, 'last100messages')
        this._callEvent(EVENTS.firstData, resp.data || [])
      }
      // RESP example => {command: "last100messages", status: true, data: Array(1)}
      // data: Array(1)
      //    0: {email: "1@ali.com", create_at: 1618298437620, message: "2021-04-13T07:20:37.572Z"}
    });

    this.socket.on('broadcast', resp => {
      console.log(resp, 'broadcast')
      if (resp && resp.command === 'newMessage' && resp.status) {
        this._callEvent(EVENTS.updateData, resp.data)
      }
      // RESP example => {command: "newMessage", status: true, data: {…}}
      // data: {email: "2@ali.com", create_at: 1618298486239, message: "2021-04-13T07:21:26.201Z"}
    });
  }
}

export const trollboxSocket = new TrollBox();
