const Joi = require('@hapi/joi');

// Patient validation
const patientValidation = (data) => {
  const schema = Joi.object().keys({
    firstName: Joi.string()
      .min(2)
      .max(15)
      .alphanum()
      .required(),
    lastName: Joi.string()
      .min(2)
      .max(15)
      .alphanum()
      .required(),
    birthday: Joi.date()
      .required()
  });
  return schema.validate(data, schema);
};

module.exports = {
  patientValidation
};
