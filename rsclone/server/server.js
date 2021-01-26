// Modules
const path = require('path');
const http = require('http');

const Socket = require('./components/socket');
const Db = require('./components/db');
const App = require('./components/app');

class Server {
  constructor(port, documentRoot, dbUser, dbPass) {
    this.port = port;
    this.app = new App(port, documentRoot);
    this.http = http.createServer(this.app.express);
    this.socket = new Socket(this.http);
    this.db = new Db(dbUser, dbPass);
    this.http.on('error', this.onError.bind(this));
    this.http.on('listening', this.onListening.bind(this));
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? `Pipe ${this.port}`
      : `Port ${this.port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    const addr = this.http.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  }
}

const APP_DIST = '../dist';
const APP_PORT = '80';
const DB_USER = 'btfUser';
const DB_PASS = 'btfPass2020q3';

const port = process.env.PORT || APP_PORT;
const documentRoot = path.resolve(__dirname, APP_DIST);
const server = new Server(port, documentRoot, DB_USER, DB_PASS);
server.http.listen(port);
