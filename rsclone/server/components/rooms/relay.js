const colyseus = require('colyseus');

exports.Relay = class extends colyseus.Room {
  onCreate(options) {
    const { parent } = options;
    this.rooms = parent.rooms;
    this.onMessage('getRoom', (client) => this.onGetRoom(client));
    this.onMessage('getRooms', (client) => this.onGetRooms(client));
  }

  onGetRoom(client) {
    for (let i = 0; i < this.rooms.length; i += 1) {
      const room = this.rooms[i];
      if (room.players < 2) {
        client.send('getRoom', room.name);
        return;
      }
    }
    client.send('getRoom', 'no rooms');
  }

  onGetRooms(client) {
    const names = [];
    for (let i = 0; i < this.rooms.length; i += 1) {
      const room = this.rooms[i];
      if (room.players === 1) names.push(room.name);
    }
    client.send('getRooms', names);
  }
};
