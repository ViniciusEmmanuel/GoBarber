const { Router } = require('express');

const routes = new Router();

const UserController = require('../controllers/UserController');

routes.put('/users', UserController.update);

module.exports = routes;
