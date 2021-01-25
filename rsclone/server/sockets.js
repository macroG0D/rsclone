const socketIO = require('socket.io');

function generateSessionName() {
  const randomNum = Math.floor(Math.random() * 9998 + 1);
  return `game#${randomNum.toString().padStart(4, '0')}`;
}

module.exports = {
  init(server) {
    this.sessions = {};
    this.io = socketIO(server, {
      cors: {
        origin: [
          'https://ibbobb.herokuapp.com',
          'http://ibbobb.herokuapp.com',
          'https://localhost',
          'http://localhost',
        ],
        methods: ['GET', 'POST'],
      },
    });
    this.io.on('connection', (socket) => {
      socket.on('playerMove', (data) => this.onPlayerMove(socket, data));
      socket.on('playerSync', (data) => this.onPlayerSync(socket, data));
      socket.on('requestHostGame', () => this.onRequestHostGame(socket));
      socket.on('requestGames', () => this.onRequestGames(socket));
      socket.on('requestDropGame', () => this.onDisconnect(socket));
      socket.on('joinGame', (sessionName) => this.onJoinGame(socket, sessionName));
      socket.on('requestStartGame', (sessionName) => this.onRequestStartGame(socket, sessionName));
      socket.on('disconnect', () => this.onDisconnect(socket));
    });
  },

  onPlayerMove(socket, data) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.playerOneSocket && session.playerTwoSocket) {
        if (session.playerOneSocket.id === socket.id || session.playerTwoSocket.id === socket.id) {
          session.playerOneSocket.emit('playerMove', data);
          session.playerTwoSocket.emit('playerMove', data);
        }
      }
    });
  },

  onPlayerSync(socket, data) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.playerOneSocket && session.playerTwoSocket) {
        if (session.playerOneSocket.id === socket.id || session.playerTwoSocket.id === socket.id) {
          session.playerOneSocket.emit('playerSync', data);
          session.playerTwoSocket.emit('playerSync', data);
        }
      }
    });
  },

  onRequestHostGame(socket) {
    if (!this.sessions[socket.id]) this.sessions[socket.id] = { gameReady: {} };
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

  onRequestGames(socket) {
    const sessionNames = [];
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && !session.playerTwoSocket) sessionNames.push(session.name);
    });
    socket.emit('requestGamesSuccess', sessionNames);
  },

  onDisconnect(socket) {
    if (this.sessions[socket.id]) this.sessions[socket.id] = undefined;
  },

  onJoinGame(socket, sessionName) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && session.name === sessionName) {
        const currentSession = session;
        currentSession.playerTwoSocket = socket;
        currentSession.playerOneSocket.emit('gameReady', session.name);
        currentSession.playerTwoSocket.emit('gameReady', session.name);
      }
    });
  },

  onRequestStartGame(socket, sessionName) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && session.name === sessionName) {
        const currentSession = session;
        const currentSocket = (currentSession.playerOneSocket.id === socket.id)
          ? 'playerOneSocket' : 'playerTwoSocket';

        currentSession.gameReady[currentSocket] = true;
        if (currentSession.gameReady.playerOneSocket && currentSession.gameReady.playerTwoSocket) {
          currentSession.playerOneSocket.emit('startGame', { online: true, master: true });
          currentSession.playerTwoSocket.emit('startGame', { online: true, master: false });
        }
      }
    });
  },
};
