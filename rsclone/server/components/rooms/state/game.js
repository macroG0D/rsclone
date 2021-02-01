const schema = require('@colyseus/schema');

class State extends schema.Schema {}

schema.defineTypes(State, {
  mySynchronizedProperty: 'string',
});

exports.State = State;
