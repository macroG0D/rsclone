const path = require('path');
const http = require('http');
const Socket = require('./components/socket');
const Db = require('./components/db');
const App = require('./components/app');

const { DB_USER, DB_PASS } = require('./credentials');

class Server {
  constructor(port, documentRoot, dbUser, dbPass) {
    this.port = port;
    this.app = new App(port, documentRoot);
    this.http = http.createServer(this.app.express);
    this.db = new Db(dbUser, dbPass);
    this.socket = new Socket(this.http, this.db);
    this.http.on('error', this.onError.bind(this));
    this.http.on('listening', this.onListening.bind(this));
  }

  onError(error) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof this.port === 'string'
      ? `Pipe ${this.port}`
      : `Port ${this.port}`;

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

// Server entry point
const APP_DIST = '../dist';
const APP_PORT = 80;

const port = process.env.PORT || APP_PORT;
const documentRoot = path.resolve(__dirname, APP_DIST);
const server = new Server(port, documentRoot, DB_USER, DB_PASS);
server.http.listen(port);
