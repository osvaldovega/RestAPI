const Users = require('../../models/users');
const helper = require('../../../utils/helpers');

// LOGIN VALIDATION
const authenticate = async (ctx) => {
  const { body } = ctx.request;

  if (!Object.keys(body).length) {
    ctx.status = 404;
    ctx.body = { message: 'No body data found' };
    return ctx;
  }

  const user = await Users.find({ email: body.email });

  const isValid = await helper.validatePassword(body.password, user[0].password);
  const userData = { username: user.username, email: user.email };

  if (!isValid) {
    ctx.status = 403;
    ctx.body = { message: 'Invalid password' };
    return ctx;
  }

  const response = {
    accessToken: helper.generateAccessToken(userData),
    refreshToken: helper.generateRefreshAccessToken(userData),
  };

  ctx.status = 200;
  ctx.body = response;
  return ctx;
};

module.exports = {
  authenticate,
};
