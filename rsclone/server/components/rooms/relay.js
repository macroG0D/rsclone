const colyseus = require('colyseus');

exports.Relay = class extends colyseus.Room {
  onCreate(data) {
    console.log(data);
    const { socket, rooms } = data;
    this.socket = socket;
    this.rooms = rooms;
    this.onMessage('getRoom', (client) => this.onGetRoom(client));
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
};
