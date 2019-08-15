const { Router } = require('express');

const routes = new Router();

const multer = require('multer');
const multerConfig = require('../../config/multer');
const FileController = require('../controllers/FileController');

const upload = multer(multerConfig);

routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;
