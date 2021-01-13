const socketIO = require('socket.io');

module.exports = {
  init(server) {
    this.sessions = [];
    this.io = socketIO(server);
    this.io.on('connection', (socket) => {
      socket.on('playerMove', (data) => this.onPlayerMove(socket, data));
      this.onConnection(socket);
    });
  },

  onPlayerMove(socket, data) {
    const session = this.sessions.find(
      (sess) => (sess.playerOneSocket === socket || sess.playerTwoSocket === socket),
    );

    if (session) {
      const partnerSocket = (session.playerOneSocket === socket)
        ? session.playerTwoSocket : session.playerOneSocket;
      partnerSocket.emit('partnerMove', data);
    }
  },

  getPendingSession() {
    return this.sessions.find(
      (session) => (session.playerOneSocket && !session.playerTwoSocket),
    );
  },

  createPendingSession(socket) {
    const session = { playerOneSocket: socket, playerTwoSocket: null };
    this.sessions.push(session);
  },

  startGame(session) {
    session.playerOneSocket.emit('gameStart', { master: true });
    session.playerTwoSocket.emit('gameStart');
  },

  onConnection(socket) {
    console.log(`new user connected ${socket.id}`);
    const session = this.getPendingSession();
    if (!session) this.createPendingSession(socket);
    session.playerTwoSocket = socket;
    this.startGame(session);
  },
};
