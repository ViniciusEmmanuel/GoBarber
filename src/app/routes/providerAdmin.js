const { Router } = require('express');

const routes = new Router();

const ProviderAdminController = require('../controllers/ProviderAdminController');

routes.get('/admin/provider/', ProviderAdminController.index);
routes.post('/admin/provider/', ProviderAdminController.store);

module.exports = routes;
