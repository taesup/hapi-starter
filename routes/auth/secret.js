const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/secret',
  config: {
    auth: { mode: 'required' }
  },
  handler: async (request, h) => {
    return h.response('This is a secret');
  }
}
