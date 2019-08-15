const { Router } = require('express');

const routes = new Router();

const NotificationController = require('../controllers/NotificationController');

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

module.exports = routes;
