const PORT = '80';
const APP_DIST = '../dist';

// Modules
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const sockets = require('./sockets');
const logger = require('morgan');

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({
    statusCode: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  res.json({
    statusCode: 500,
    message: err.message,
    stack: err.stack
  });
});



const port = normalizePort(process.env.PORT || PORT );
app.set('port', port);

const server = http.createServer(app);

// Sockets init
sockets.init(server);

// Run the server
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}