const PORT = 80;
const APP_DIST = '../dist';

// Modules
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const sockets = require('./sockets');

// Create the server
const app = express();
app.use(cors());
app.options('*', cors());
const server = http.createServer(app);

// Host the app
const documentRoot = path.resolve(__dirname, APP_DIST);
const staticContent = express.static(documentRoot);
app.use(staticContent);

// Sockets init
sockets.init(server);

// Run the server
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
