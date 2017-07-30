const Joi = require('joi');
const Boom = require('boom');

module.exports = {
  method: 'POST',
  path: '/register',
  config: {
    auth: { strategy: 'session', mode: 'try' },
    validate: {
      payload: {
        username: Joi.string().min(1).required(),
        password: Joi.string().min(6).required()
      }
    }
  },
  handler: (request, reply) => {
    console.log(request.auth);
    if (request.auth.isAuthenticated) { return reply.redirect('/'); }

    let username = request.payload.username;
    let promise = request.models.User.create(request.payload)
    .then((user) => {
      return new Promise((resolve, reject) => {
        request.server.app.cache.set('user:' + user.id, { account: user }, null, (err) => {
          if (err) { return reject(err); }
          request.cookieAuth.set({ sid: 'user:' + user.id });
          return resolve();
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return Boom.badImplementation();
    });
    return reply(promise);
  }
}
