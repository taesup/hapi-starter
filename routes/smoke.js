const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/smoke/{name}',
  config: {
    auth: false,
    validate: {
      params: { name: Joi.string().required() }
    }
  },
  handler: async (request, h) => {
    try {
      await request.db.select('*').from('users');
      return h.response('test passed');
    }
    catch(err) { return Boom.badImplementation(); }
  }
}
