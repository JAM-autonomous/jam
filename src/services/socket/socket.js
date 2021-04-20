import { io } from 'socket.io-client';
import authService from '../auth';
import { logService } from '../log';

const Log = logService.createLog("Base Socket");

export class BaseSocket {
  constructor(ns, host, path) {
    this.ns = ns;
    this.host = host;
    this.path = path || '';
    this.events = {};
    this._prevSocket = null;
    this.auth = null;
  }

  get socket() {
    if (!this.auth) this.auth = authService.auth;
    if (!this.auth) throw new Error('Must run "init" with auth first');
    const opts = { query: { userId: this.auth.id }, auth: { token: this.auth.token } }
    if (this.path != '') {
      opts['path'] = this.path
    }
    this._prevSocket = this._prevSocket || io(`${this.host}/${this.ns}`, opts);
    return this._prevSocket;
  }

  _callEvent(name, ...agrs) {
    const handler = this.events[name];

    if (typeof handler === 'function') {
      handler(...agrs);
    }
  }

  init(auth) {
    this.auth = auth;

    this.listen();
  }
  
  listen() {
    Log.info('Implement "listen" here');
  }
}
