const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  username: {
    type: String,
    min: 3,
    max: 15,
    required: true
  },
  email: {
    type: String,
    min: 6,
    max: 15,
    unique: true,
    required: true
  },
  password: {
    type: String,
    min: 6,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Users', UsersSchema);
