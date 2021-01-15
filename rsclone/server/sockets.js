const socketIO = require('socket.io');

function generateSessionName() {
  const randomNum = Math.floor(Math.random() * 9998 + 1);
  return `game#${randomNum.toString().padStart(4, '0')}`;
}

module.exports = {
  init(server) {
    this.sessions = {};
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      socket.on('hostGame', (data) => this.onHostGame(socket, data));
      socket.on('disconnect', () => console.log('user disconnected'));
      // this.onConnection(socket);
    });
  },

  onHostGame(socket) {
    let sessionName;
    while (!sessionName || (sessionName && sessionName in this.sessions)) {
      sessionName = generateSessionName();
    }
    console.log(socket.id, sessionName);
  },
};
