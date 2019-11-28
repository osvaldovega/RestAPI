const mongoose = require('mongoose');

const PatientsSchema = mongoose.Schema({
  firstName: {
    type: String,
    min: 2,
    max: 15,
    required: true
  },
  lastName: {
    type: String,
    min: 2,
    max: 15,
    required: true
  },
  birthday: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patients', PatientsSchema);
