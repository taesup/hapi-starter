const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/logout',
  config: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: (request, reply) => {
    console.log(request.auth);
    if (request.auth.isAuthenticated) { request.cookieAuth.clear(); }
    return reply.redirect('/');
  }
}
