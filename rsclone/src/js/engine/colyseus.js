import Phaser from 'phaser';
import * as ColClient from 'colyseus.js';

import { SERVER_HOST } from '../constants';

export default class Colyseus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.sent = {};
    const host = SERVER_HOST.replace('http', 'ws');
    const port = 4567;
    this.client = new ColClient.Client(`${host}:${port}`);
  }

  init() {
    this.client.joinOrCreate('relay').then((relay) => {
      this.regListeners(relay);
      this.relay = relay;
    }).catch((e) => {
      console.error('join to relay error', e);
    });
  }

  regListeners(relay) {
    relay.onLeave((_, consented) => {
      if (!consented) this.relay = false;
    });
    relay.onMessage('*', (key, data) => this.emit(key, data));
  }

  doSend(key, data) {
    if (!this.relay) {
      this.client.joinOrCreate('relay').then((relay) => {
        this.regListeners(relay);
        relay.send(key, data);
      }).catch((e) => {
        console.error('join to relay error', e);
      });
      this.init();
    } else {
      this.relay.send(key, data);
    }
  }

  sendData(key, data) {
    if (this.checkSend(key, data)) {
      this.sent[key] = JSON.stringify(data);
      this.doSend(key, data);
    }
  }

  checkSend(key, data) {
    return (!this.sent[key] || (this.sent[key] !== JSON.stringify(data)));
  }
}
