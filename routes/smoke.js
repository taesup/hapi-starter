const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/smoke/{name}',
  config: {
    validate: {
      params: { name: Joi.string().required() }
    }
  },
  handler: (request, reply) => {
    return reply('test passed');
  }
}
