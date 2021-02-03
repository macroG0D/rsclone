const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');

module.exports = class App {
  constructor(port, documentRoot) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Server logs
    const logFile = fs.createWriteStream(
      path.join(__dirname, '../logs/access.log'),
      { flags: 'a' },
    );
    app.use(morgan('common', { stream: logFile }));

    const staticContent = express.static(documentRoot);
    app.use(staticContent);
    app.set('port', port);
    this.express = app;
  }
};
