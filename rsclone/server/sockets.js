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
      socket.on('requestHostGame', () => this.onRequestHostGame(socket));
      socket.on('requestJoinGame', () => this.onRequestJoinGame(socket));
      socket.on('requestDropGame', () => this.onDisconnect(socket));
      socket.on('joinGame', (sessionName) => this.onJoinGame(socket, sessionName));
      socket.on('disconnect', () => this.onDisconnect(socket));
    });
  },

  onRequestHostGame(socket) {
    if (!this.sessions[socket.id]) this.sessions[socket.id] = {};
    const session = this.sessions[socket.id];

    if (!session.name) session.name = generateSessionName();

    if (!session.playerOneSocket || session.playerOneSocket.id !== socket.id) {
      session.playerOneSocket = socket;
    }

    if (session.playerTwoSocket) {
      session.playerTwoSocket.emit('dropGame');
      session.playerTwoSocket = undefined;
    }

    session.playerOneSocket.emit('hostGameSuccess', session.name);
  },

  onRequestJoinGame(socket) {
    const sessionNames = [];
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && !session.playerTwoSocket) sessionNames.push(session.name);
    });
    socket.emit('joinGameSuccess', sessionNames);
  },

  onDisconnect(socket) {
    if (this.sessions[socket.id]) this.sessions[socket.id] = undefined;
  },

  onJoinGame(socket, sessionName) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && session.name === sessionName) {
        const currentSession = session;
        currentSession.playerTwoSocket = socket;
        // Start the game;
        currentSession.playerOneSocket.emit('startGame', { master: true });
        currentSession.playerTwoSocket.emit('startGame', { master: false });
      }
    });
  },
};
