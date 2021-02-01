const http = require('http');
const express = require('express');
const cors = require('cors');
const colyseus = require('colyseus');

const { Game } = require('./rooms/game');
const { Relay } = require('./rooms/relay');

const { MAX_ROOMS } = require('../constants');

const port = process.env.PORT || 4567;
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

module.exports = class Colyseus {
  constructor() {
    this.rooms = [];
    const gameServer = new colyseus.Server({ server });
    const relay = gameServer.define('relay', Relay, { parent: this });
    this.relay = relay;
    for (let i = 1; i <= MAX_ROOMS; i += 1) {
      const postfix = i.toString().padStart(2, '0');
      const name = `game_${postfix}`;
      const room = gameServer.define(name, Game, { parent: this, index: i - 1 });
      room.enableRealtimeListing();
      room.name = name;
      room.players = 0;
      this.rooms.push(room);
    }
    this.gameServer = gameServer;
    gameServer.listen(port);
    console.log(`Colyseus is on port: ${port}`);
  }
};
