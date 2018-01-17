const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  method: 'GET',
  path: '/register',
  config: { auth: false },
  handler: async (request, h) => {
    return h.file('./register.html');
  }
}
