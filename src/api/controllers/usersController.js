const Users = require('../models/users');
const helper = require('../../../utils/helpers');

const users = {
  // GET ALL USERS
  find: async () => {
    const result = await Users.find();
    return result;
  },

  // GET A USERS
  findById: async (id) => {
    const result = await Users.findById(id);
    return result;
  },


  // ADD A NEW USERS
  add: async (data) => {
    const { username, password, email } = data;
    const patient = new Users({
      username,
      password: await helper.hashPassword(password),
      email
    });
    const result = await patient.save();
    return result;
  },

  // UPDATE A  USERS
  update: async (id, data) => {
    const { username, password, email } = data;
    const result = await Users.updateOne({ _id: id }, {
      $set: {
        username,
        password,
        email
      }
    });
    return result;
  },

  // DELETE A  USERS
  delete: async (id) => {
    const result = await Users.remove({ _id: id });
    return result;
  }
};

module.exports = users;
