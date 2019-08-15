const { Router } = require('express');

const routes = new Router();

const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

module.exports = routes;
