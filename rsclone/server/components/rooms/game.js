const colyseus = require('colyseus');
const { State } = require('./state/game');

exports.Game = class extends colyseus.Room {
  onCreate(socket) {
    this.socket = socket;
    this.setState(new State());
    this.maxClients = 2;
    this.allowReconnectionTime = 120;
    this.onMessage('type', (client, message) => {
    });
  }

  onJoin(client, options) {
    console.log(client);
  }

  onLeave(client, consented) {
  }

  onDispose() {
  }
};
