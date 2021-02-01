const colyseus = require('colyseus');
const { State } = require('./state/game');

exports.Game = class extends colyseus.Room {
  onCreate(options) {
    const { parent, index } = options;
    this.parent = parent;
    this.room = parent.rooms[index];
    this.session = {};
    this.setState(new State());
    this.maxClients = 2;
    this.allowReconnectionTime = 120;
  }

  onJoin(client) {
    const { name } = this.room;
    if (this.room.players < 2) this.room.players += 1;
    console.log(`${name}: client joined - ${client.id}`);

    if (!this.master) {
      this.master = client.id;
      this.session[client.id] = client;
    } else {
      this.slave = client.id;
      this.session[client.id] = client;
      this.lock();
    }

    client.send('joinRoom', name);

    if (this.master && this.slave) {
      this.session[this.master].send('startGame');
      this.session[this.slave].send('startGame');
      this.started = true;
    }
  }

  onLeave(client) {
    const { name } = this.room;
    if (this.room.players > 0) this.room.players -= 1;
    if (this.locked) this.unlock();
    console.log(`${name}: client left - ${client.id}`);
    if (client.id === this.master || this.started) {
      this.started = false;
      this.disconnect();
    }
  }

  onDispose() {
    this.room.players = 0;
    if (this.locked) this.unlock();
  }
};
