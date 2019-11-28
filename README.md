REST API
==================================

Introduction
------------

This is a simple REST API application that use MongoDB as storage, for execute HTTP requests like.

- GET - Get all the patients
- GET - Get a specific patient using ID
- POST - Add a new patient
- DELETE - Remove a patient from the DB using the ID
- UPDATE- Update patient data

#### Modules Used

* Expressjs as the http platform
* Winston for logging (Plugging Loggers)
* Dotenv for handling environments configuration
* Eslint (using Airbnb style guide)

#### Pre requisites

* Recent Linux Distribution / OSX (Not tested in Windows)
* Node.js v12.11.0+

#### Installation

* Clone the repository
* npm install
* npm start

* The server listens in port 3000 but it can be configured in by the files in /envs
* Logs are stored in ./logs if you want to see the output the logs rotate each day so you need to check the date and then can tail the correct file
  
NOTE: you can go to the ./envs directory and copy the  settings from one of the files and create a new .env file in root and paste  the configuraction, this is necessary for the application run.


#### Author

* Osvaldo Vega

#### License

License

Copyright (c) 2019 Osvaldo Vega - GPL 3.0