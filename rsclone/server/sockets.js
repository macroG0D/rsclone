const socketIO = require('socket.io');

function generateSession() {
  const randomNum = Math.floor(Math.random() * 9998 + 1);
  return `game#${randomNum.toString().padStart(4, '0')}`;
}

module.exports = {
  init(server) {
    this.sessions = {};
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      socket.on('hostGame', (data) => this.onHostGame(socket, data));
      // this.onConnection(socket);
    });
  },

  onHostGame(socket) {
    let sessionName = generateSession();
    while (sessionName in this.sessions) sessionName = generateSession();
    console.log(sessionName);
  },
};
