const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const ProviderController = require('./app/controllers/ProviderController');
const FileController = require('./app/controllers/FileController');
const authMiddleware = require('./app/middlewates/auth');

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;
