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

  joinGameRoom(name) {
    this.client.joinOrCreate(name).then((room) => {
      this.regRoomListeners(room);
      this.room = room;
    }).catch((e) => {
      console.error('join to room error', e);
    });
  }

  getRooms() {
    this.client.getAvailableRooms().then((rooms) => this.emit('getRooms', rooms))
      .catch((e) => { console.error('join to room error', e); });
  }

  leaveGameRoom() {
    if (this.room) {
      this.room.leave();
      this.room = undefined;
    }
  }

  regRoomListeners(room) {
    room.onLeave((_, consented) => { if (!consented) this.room = false; });
    room.onMessage('*', (key, data) => this.emit(key, data));
  }

  regRelayListeners(relay) {
    relay.onLeave((_, consented) => { if (!consented) this.relay = false; });
    relay.onMessage('*', (key, data) => this.emit(key, data));
  }

  doRelaySend(key, data) {
    if (!this.relay) {
      this.client.joinOrCreate('relay').then((relay) => {
        this.regRelayListeners(relay);
        relay.send(key, data);
        this.relay = relay;
      }).catch((e) => {
        console.error('join to relay error', e);
      });
    } else {
      this.relay.send(key, data);
    }
  }

  relaySend(key, data) {
    if (this.checkSend('relay', key, data)) {
      this.sent.relay[key] = JSON.stringify(data);
      this.doRelaySend(key, data);
    }
  }

  roomSend(key, data) {
    if (!this.room) return;
    if (this.checkSend('room', key, data)) {
      this.sent.room[key] = JSON.stringify(data);
      this.room.send(key, data);
    }
  }

  checkSend(room, key, data) {
    if (!this.sent[room]) this.sent[room] = {};
    return (!this.sent[room][key] || (this.sent[room][key] !== JSON.stringify(data)));
  }
}
