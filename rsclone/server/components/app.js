const logger = require('morgan');
const express = require('express');
const cors = require('cors');

module.exports = class App {
  constructor(port, documentRoot) {
    const app = express();
    app.use(logger('dev'));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    const staticContent = express.static(documentRoot);
    app.use(staticContent);
    app.set('port', port);
    this.express = app;
  }
};
