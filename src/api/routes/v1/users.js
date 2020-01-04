// Users Endpoints
const Router = require('@koa/router');
const controllers = require('../../controllers/v1');


const usersRoutes = new Router({ prefix: '/api/v1' });

// Return all users information
usersRoutes.get('/users', controllers.users.all);

// Return all user information for specific user
usersRoutes.get('/users/:id', controllers.users.one);

// Add an user and return its data
usersRoutes.post('/users', controllers.users.add);

// Update data for a specific user
usersRoutes.patch('/users/:id', controllers.users.update);

// Delete a specific user
usersRoutes.del('/users/:id', controllers.users.remove);

module.exports = usersRoutes;
