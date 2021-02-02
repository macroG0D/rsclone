const schema = require('@colyseus/schema');
const { Player } = require('./player');

const { Schema } = schema;
const { MapSchema } = schema;

class State extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }
}
schema.defineTypes(State, {
  players: { map: Player },
});

exports.State = State;
