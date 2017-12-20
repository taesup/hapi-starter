const Joi = require('joi');
const Boom = require('boom');
const bcrypt = require('bcrypt');

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
    if (request.auth.isAuthenticated) { return reply.redirect('/'); }

    let username = request.payload.username;
    let password = bcrypt.hashSync(request.payload.password, 15);

    let promise = request.db('users').insert({
      username: username,
      password: password
    }).returning('*')
    .then((user) => {
      user = user[0];
      console.log(user);

      let cachedUser = { username: username };
      return new Promise((resolve, reject) => {
        request.server.app.cache.set('user:' + user.id, cachedUser, 0, (err) => {
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
