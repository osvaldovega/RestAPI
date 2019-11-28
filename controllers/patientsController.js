const Patients = require('../models/patients');

const patients = {
  // GET ALL PATIENTS
  find: async () => {
    const result = await Patients.find();
    return result;
  },

  // GET A PATIENT
  findById: async (id) => {
    const result = await Patients.findById(id);
    return result;
  },


  // ADD A NEW PATIENT
  add: async (data) => {
    const { firstName, lastName, birthday } = data;
    const patient = new Patients({ firstName, lastName, birthday });
    const result = await patient.save();
    return result;
  },

  // UPDATE A  PATIENT
  update: async (id, data) => {
    const { firstName, lastName, birthday } = data;
    const result = await Patients.updateOne({ _id: id }, {
      $set: {
        firstName,
        lastName,
        birthday
      }
    });
    return result;
  },

  // DELETE A  PATIENT
  delete: async (id) => {
    const result = await Patients.remove({ _id: id });
    return result;
  }
};

module.exports = patients;
