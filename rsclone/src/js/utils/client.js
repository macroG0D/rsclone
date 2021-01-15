import Phaser from 'phaser';
import io from 'socket.io-client';

import { SERVER_HOST } from '../constants';

export default class Client extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.sent = {};
    this.master = false;
    this.socket = io(SERVER_HOST);
    this.socket.on('connect', () => console.log('client connected'));
    this.socket.on('disconnect', () => console.log('client disconnected'));

    this.socket.on('hostGameSuccess', (sessionName) => {
      if (sessionName) this.emit('hostGameSuccess', sessionName);
    });

    this.socket.on('joinGameSuccess', (sessionNames) => {
      if (sessionNames) this.emit('joinGameSuccess', sessionNames);
    });
  }

  sendData(key, data) {
    if (this.checkSend(key, data)) {
      this.sent[key] = JSON.stringify(data);
      this.socket.emit(key, data);
    }
  }

  checkSend(key, data) {
    return (!this.sent[key] || (this.sent[key] !== JSON.stringify(data)));
  }
}
