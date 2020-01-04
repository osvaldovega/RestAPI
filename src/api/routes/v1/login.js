// Login Endpoints
const Router = require('@koa/router');
const controller = require('../../controllers/v1');


const loginRoutes = new Router({ prefix: '/api/v1' });

// Login and validate user
loginRoutes.post('/login', controller.login.authenticate);

module.exports = loginRoutes;
