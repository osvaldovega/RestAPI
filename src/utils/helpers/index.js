const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ENCRYPTING PASSWORD
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));
  return hashedPassword;
};

// VALIDATE ENCRYPTED PASSWORD
const validatePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

// GENERATE TOKEN WITH JWT
const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });

// GENERATE REFRESH TOKEN WITH JWT
const generateRefreshAccessToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

// VALIDATE TOKEN WITH JWT
const verifyAccessToken = async (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

module.exports = {
  generateAccessToken,
  generateRefreshAccessToken,
  hashPassword,
  validatePassword,
  verifyAccessToken,
};
