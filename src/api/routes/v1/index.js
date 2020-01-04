const healthRoutes = require('./health');
const loginRoutes = require('./login');
const usersRoutes = require('./users');

module.exports = {
  health: healthRoutes,
  login: loginRoutes,
  users: usersRoutes,
};
