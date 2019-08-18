const express = require('express');
const path = require('path');
const Sentry = require('@sentry/node');
const routes = require('./routes');
const sentryConfig = require('./config/sentry');

require('express-async-errors');
require('./database');

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(express.json());

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);

    this.server.use(Sentry.Handlers.errorHandler());
  }
}

module.exports = new App().server;
