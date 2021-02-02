const schema = require('@colyseus/schema');

const { Schema } = schema;

class Player extends Schema {}

schema.defineTypes(Player, {
  key: 'string',
  x: 'number',
  y: 'number',
  angle: 'number',
  disableGravitySwitch: 'boolean',
  isAlive: 'boolean',
  isCarrying: 'boolean',
  isGrounded: 'boolean',
  left: 'boolean',
  right: 'boolean',
  up: 'boolean',
  down: 'boolean',
});

exports.Player = Player;
