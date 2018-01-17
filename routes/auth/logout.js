const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/logout',
  config: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) { request.cookieAuth.clear(); }
    return h.redirect('/');
  }
}
