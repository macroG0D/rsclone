const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');

const { Game } = require('./rooms/game');
const { Relay } = require('./rooms/relay');

const { MAX_ROOMS } = require('../constants');

function generateRooms(maxRooms) {
  const rooms = [];
  for (let i = 1; i <= maxRooms; i += 1) {
    const postfix = i.toString().padStart(2, '0');
    const name = `game_${postfix}`;
    const room = { name, players: 0 };
    rooms.push(room);
  }
  return rooms;
}

const port = process.env.PORT || 4567;
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const rooms = generateRooms(MAX_ROOMS);

module.exports = class Colyseus {
  constructor(socket) {
    this.rooms = rooms;
    const gameServer = new colyseus.Server({ server });
    const relay = gameServer.define('relay', Relay, { socket, rooms: this.rooms });
    relay.enableRealtimeListing();
    for (let i = 1; i <= MAX_ROOMS; i += 1) {
      const postfix = i.toString().padStart(2, '0');
      const name = `game_${postfix}`;
      gameServer.define(name, Game);
    }
    this.gameServer = gameServer;
    gameServer.listen(port);
    console.log(`Colyseus is on port: ${port}`);
  }
};
