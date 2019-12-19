const UserController = require('./usersController');
const AuthController = require('./authenticate');

module.exports = {
  users: UserController,
  login: AuthController
};
