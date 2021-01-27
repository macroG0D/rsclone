import Phaser from 'phaser';
import io from 'socket.io-client';

import { SERVER_HOST } from '../constants';

const SOCKET_IO_OPTIONS = {
  reconnection: true,
  reconnectionAttempts: 2,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  autoConnect: false,
};

export default class Client extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.sent = {};
    this.socket = io(SERVER_HOST, SOCKET_IO_OPTIONS);
    this.socket.on('connect', () => console.log('client connected'));
    this.socket.on('disconnect', () => console.log('client disconnected'));
    this.socket.on('connect_error', () => console.log('Connection Failed'));

    this.socket.on('hostGameSuccess', (sessionName) => {
      if (sessionName) this.emit('hostGameSuccess', sessionName);
    });

    this.socket.on('requestGamesSuccess', (sessionNames) => {
      if (sessionNames) this.emit('requestGamesSuccess', sessionNames);
    });

    this.socket.on('startGame', (gameData) => this.emit('startGame', gameData));
    this.socket.on('gameReady', (sessionName) => this.emit('gameReady', sessionName));
    this.socket.on('playerMove', (data) => this.emit('playerMove', data));
    this.socket.on('playerSync', (data) => this.emit('playerSync', data));
  }

  sendData(key, data) {
    if (this.checkSend(key, data)) {
      this.sent[key] = JSON.stringify(data);
      if (this.socket && this.socket.connected) this.socket.emit(key, data);
    }
  }

  checkSend(key, data) {
    return (!this.sent[key] || (this.sent[key] !== JSON.stringify(data)));
  }
}
