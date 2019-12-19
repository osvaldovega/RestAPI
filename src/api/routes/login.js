const AuthController = require('../controllers/authenticate');

// SUBMITS NEW RECORD
const login = async (req, res) => {
  try {
    const data = await AuthController.login(req.body);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = login;
