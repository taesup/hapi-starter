const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/login',
  config: { auth: false },
  handler: async (request, h) => {
    return h.file('./login.html');
  }
}
