const { Router } = require('express');

const routes = new Router();

const authMiddleware = require('./app/middlewares/auth');

const Appointments = require('./app/routes/appointments');
const Provider = require('./app/routes/providers');
const ProviderAdmin = require('./app/routes/providerAdmin');
const Schedule = require('./app/routes/schedule');
const Users = require('./app/routes/users');
const Notifications = require('./app/routes/notifications');
const Login = require('./app/routes/login');

routes.use(Login);

routes.use(authMiddleware);

routes.use(Appointments);
routes.use(Provider);
routes.use(ProviderAdmin);
routes.use(Schedule);
routes.use(Users);
routes.use(Notifications);

module.exports = routes;
