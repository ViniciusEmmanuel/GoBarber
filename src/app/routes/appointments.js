const { Router } = require('express');

const routes = new Router();

const AppointmentController = require('../controllers/AppointmentController');

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

module.exports = routes;
