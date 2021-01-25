const PORT = '80';
const APP_DIST = '../dist';

// Modules
const path = require('path');
const logger = require('morgan');
const express = require('express');
const cors = require('cors');
const http = require('http');
const sockets = require('./sockets');

// Create the server
const app = express();
app.use(logger('dev'));
app.use(cors());
// app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Host the app
const documentRoot = path.resolve(__dirname, APP_DIST);
const staticContent = express.static(documentRoot);
app.use(staticContent);

app.set('port', PORT);

const server = http.createServer(app);

// Sockets init
sockets.init(server);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${PORT}`
    : `Port ${PORT}`;

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

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

// Run the server
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);
