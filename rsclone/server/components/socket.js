const socketIO = require('socket.io');

function generatePostfix() {
  const randomNum = Math.floor(Math.random() * 9998 + 1);
  return randomNum.toString().padStart(4, '0');
}
module.exports = class Socket {
  constructor(server, db) {
    this.db = db;
    this.sessions = {};
    this.io = socketIO(server, { cors: { origin: '*' } });
    this.io.on('connection', (socket) => {
      socket.on('playerMove', (data) => this.onPlayerMove(socket, data));
      socket.on('playerSync', (data) => this.onPlayerSync(socket, data));
      socket.on('requestHostGame', () => this.onRequestHostGame(socket));
      socket.on('requestGames', () => this.onRequestGames(socket));
      socket.on('requestDropGame', () => this.onDisconnect(socket));
      socket.on('joinGame', (sessionName) => this.onJoinGame(socket, sessionName));
      socket.on('requestStartGame', (sessionName) => this.onRequestStartGame(socket, sessionName));
      socket.on('disconnect', () => this.onDisconnect(socket));
      socket.on('checkScore', (data) => this.onCheckScore(socket, data));
      socket.on('getScore', () => this.onGetScores(socket));
      socket.on('updateName', (data) => this.onUpdateName(data));
    });
  }

  onUpdateName(data) {
    const { id, name } = data;
    const callBack = (result, error) => {
      if (error) console.log('Error:', error);
    };
    this.db.query('update', callBack, id, { $set: { name } });
  }

  onGetScores(socket) {
    const callBack = (result, error) => {
      if (error) {
        console.log('Error:', error);
        return;
      }
      socket.emit('getScore', result);
    };
    this.db.query('getAll', callBack);
  }

  checkScore(socket, item) {
    const callBack = (result, error) => {
      if (error) {
        console.log('Error:', error);
        return;
      }
      const filterField = '_id';
      const itemId = item[filterField].toString();
      const score = +item.score.toString();
      const time = +item.time.toString();
      let position = -1;
      result.filter((resItem, index) => {
        const resItemId = resItem[filterField].toString();
        const found = (itemId === resItemId);
        if (found) position = index + 1;
        return found;
      });

      const sendData = {
        position,
        id: itemId,
        score,
        time,
      };

      const action = (position <= 100 && position >= 0) ? 'newRecord' : 'noRecord';
      socket.emit(action, sendData);
    };

    this.db.query('getAll', callBack);
  }

  onCheckScore(socket, data) {
    const callBack = (result, error) => {
      if (error) {
        console.log('Error:', error);
        return;
      }
      const item = result.ops[0];
      if (item) this.checkScore(socket, item);
    };
    const newItem = data;
    const postfix = generatePostfix();
    if (!newItem.name) newItem.name = `noName_${postfix}`;
    this.db.query('create', callBack, newItem);
  }

  onPlayerMove(socket, data) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.playerOneSocket && session.playerTwoSocket) {
        if (session.playerOneSocket.id === socket.id || session.playerTwoSocket.id === socket.id) {
          session.playerOneSocket.emit('playerMove', data);
          session.playerTwoSocket.emit('playerMove', data);
        }
      }
    });
  }

  onPlayerSync(socket, data) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.playerOneSocket && session.playerTwoSocket) {
        if (session.playerOneSocket.id === socket.id || session.playerTwoSocket.id === socket.id) {
          session.playerOneSocket.emit('playerSync', data);
          session.playerTwoSocket.emit('playerSync', data);
        }
      }
    });
  }

  onRequestHostGame(socket) {
    if (!this.sessions[socket.id]) this.sessions[socket.id] = { gameReady: {} };
    const session = this.sessions[socket.id];

    const postfix = generatePostfix();
    if (!session.name) session.name = `game#${postfix}`;

    if (!session.playerOneSocket || session.playerOneSocket.id !== socket.id) {
      session.playerOneSocket = socket;
    }

    if (session.playerTwoSocket) {
      session.playerTwoSocket.emit('dropGame');
      session.playerTwoSocket = undefined;
    }

    session.playerOneSocket.emit('hostGameSuccess', session.name);
  }

  onRequestGames(socket) {
    const sessionNames = [];
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && !session.playerTwoSocket) sessionNames.push(session.name);
    });
    socket.emit('requestGamesSuccess', sessionNames);
  }

  onDisconnect(socket) {
    if (this.sessions[socket.id]) this.sessions[socket.id] = undefined;
  }

  onJoinGame(socket, sessionName) {
    Object.values(this.sessions).forEach((session) => {
      if (session && session.name && session.name === sessionName) {
        const currentSession = session;
        currentSession.playerTwoSocket = socket;
        currentSession.playerOneSocket.emit('gameReady', session.name);
        currentSession.playerTwoSocket.emit('gameReady', session.name);
      }
    });
  }

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
  }
};
