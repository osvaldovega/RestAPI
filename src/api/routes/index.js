const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

// GET ALL THE RECORDS
router.get('/:resource', async (req, res) => {
  const { resource } = req.params;
  try {
    const data = await controllers[resource].find();
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// SUBMITS NEW RECORD
router.post('/:resource', async (req, res) => {
  const { resource } = req.params;

  try {
    const data = await controllers[resource].add(req.body);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET A SPECIFIC RECORD
router.get('/:resource/:id', async (req, res) => {
  const { resource, id } = req.params;
  try {
    const data = await controllers[resource].findById(id);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// UPDATE A SPECIFIC RECORD
router.patch('/:resource/:id', async (req, res) => {
  const { resource, id } = req.params;
  try {
    const data = await controllers[resource].update(id, req.body);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// DELETE A SPECIFIC RECORD
router.delete('/:resource/:id', async (req, res) => {
  const { resource, id } = req.params;
  try {
    const data = await controllers[resource].delete(id);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
