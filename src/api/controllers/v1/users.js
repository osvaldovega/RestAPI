const Users = require('../../models/users');
const helper = require('../../../utils/helpers');

// GET ALL USERS
const all = async (ctx) => {
  const result = await Users.find();
  ctx.status = 200;
  ctx.body = { data: result };
  return ctx;
};

// GET A USERS
const one = async (ctx) => {
  const { id } = ctx.params;

  try {
    const result = await Users.findById(id);
    ctx.status = 200;
    ctx.body = { data: [result] };
    return ctx;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: error.message };
    return ctx;
  }
};

// ADD A NEW USERS
const add = async (ctx) => {
  const { username, password, email } = ctx.request.body;

  const user = new Users({
    username,
    password: await helper.hashPassword(password),
    email,
  });

  try {
    const result = await user.save();
    ctx.status = 200;
    ctx.body = { data: [result] };
    return ctx;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: error.message };
    return ctx;
  }
};

// UPDATE A  USERS
const update = async (ctx) => {
  const { id } = ctx.params;
  const { username, password, email } = ctx.request.body;

  try {
    await Users.updateOne({ _id: id }, {
      $set: {
        username,
        password: await helper.hashPassword(password),
        email,
      },
    });

    const result = await Users.findById(id);

    ctx.status = 200;
    ctx.body = { data: [result] };
    return ctx;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: error.message };
    return ctx;
  }
};

// DELETE A  USERS
const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    const result = await Users.remove({ _id: id });

    ctx.status = 200;
    ctx.body = { data: result };
    return ctx;
  } catch (error) {
    ctx.status = 404;
    ctx.body = { message: error.message };
    return ctx;
  }
};

module.exports = {
  add,
  all,
  one,
  remove,
  update,
};
