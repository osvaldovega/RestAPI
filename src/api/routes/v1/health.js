// Health Endpoints
const Router = require('@koa/router');
const controller = require('../../controllers/v1');


const healthRoutes = new Router({ prefix: '/api/v1' });

// Returns API data details
healthRoutes.get('/health', controller.health.all);

module.exports = healthRoutes;
