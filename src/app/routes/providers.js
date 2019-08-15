const { Router } = require('express');

const routes = new Router();

const ProviderController = require('../controllers/ProviderController');
const AvailableController = require('../controllers/AvailableController');

routes.get('/providers', ProviderController.index);

routes.get('/providers/:providerId/available', AvailableController.index);

module.exports = routes;
