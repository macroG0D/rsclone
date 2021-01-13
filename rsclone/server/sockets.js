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
  // находит сессию, в которой есть сокет игрока, но нет сокета противника (игрок ждет оппонента)
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
    // получить текущую ожидающую игровую сессию
    const session = this.getPendingSession();

    // если такой сессии нет
    if (!session) {
      // создать новую игровую сессию и поместить в нее сокет игрока
      this.createPendingSession(socket);
    } else {
      // если такая сессия есть - игрок уже есть и ждет противника
      // добавить в нее сокет противника
      session.playerTwoSocket = socket;
      // запустить игру событием в оба сокета
      this.startGame(session);
    }
  },
};
