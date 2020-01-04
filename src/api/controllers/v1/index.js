const AuthenticationController = require('./authenticate');
const HealthController = require('./health');
const UserController = require('./users');

module.exports = {
  health: HealthController,
  login: AuthenticationController,
  users: UserController,
};
