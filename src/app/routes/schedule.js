const { Router } = require('express');

const routes = new Router();

const ScheduleController = require('../controllers/ScheduleController');

routes.get('/schedule', ScheduleController.index);

module.exports = routes;
