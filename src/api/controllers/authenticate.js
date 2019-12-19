const Users = require('../models/users');
const helper = require('../../../utils/helpers');

// LOGIN VALIDATION
const login = async (data) => {
  const user = await Users.find({ email: data.email });
  if (!user.length) throw new Error('User not found.');

  const isValid = await helper.validatePassword(data.password, user[0].password);
  const userData = { username: user.username, email: user.email };

  if (isValid) {
    const response = {
      accessToken: helper.generateAccessToken(userData),
      refreshToken: helper.generateRefreshAccessToken(userData)
    };
    return response;
  }

  throw new Error('Invalid password');
};

module.exports = {
  login
};
