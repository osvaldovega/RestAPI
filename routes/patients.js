const express = require('express');
const Patients = require('../models/patients');

const router = express.Router();

// GET ALL THE PATIENTS
router.get('/', async (req, res) => {
  try {
    const patients = await Patients.find();
    res.json(patients);
  } catch (err) {
    res.json({ message: err });
  }
});

// SUBMITS NEW PATIENT
router.post('/', async (req, res) => {
  const patient = new Patients({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
  });

  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (err) {
    res.json({ message: err });
  }
});

// GET A SPECIFIC PATIENT
router.get('/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patient = await Patients.findById(patientId);
    res.json(patient);
  } catch (err) {
    res.json({ message: err });
  }
});

// UPDATE A SPECIFIC PATIENT
router.patch('/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const updatedPatient = await Patients.updateOne({ _id: patientId }, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: req.body.birthday,
      },
    });
    res.json(updatedPatient);
  } catch (err) {
    res.json({ message: err });
  }
});

// DELETE A SPECIFIC PATIENT
router.delete('/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const removedPatient = await Patients.remove({ _id: patientId });
    res.json(removedPatient);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
