const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const patientsRoutes = require('./routes/patients');
require('dotenv/config')

const app = express();

// SET CONFIG
app.set('port', process.env.PORT);

// MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

// ROUTES FOR PATIENTS
app.use('/patients', patientsRoutes);

// DB CONNECTION
mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DataBase Connection: Successfully.'))
  .catch((error) => console.log(`DataBase Connection Error: ${error.message}`));

module.exports = app;
