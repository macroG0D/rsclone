const schema = require('@colyseus/schema');

const { Schema } = schema;

class KeyState extends Schema {}

schema.defineTypes(KeyState, {
  left: 'boolean',
  right: 'boolean',
  up: 'boolean',
  down: 'boolean',
});

exports.KeyState = KeyState;
