const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { SongPayloadSchema };
