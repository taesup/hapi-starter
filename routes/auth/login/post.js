const Joi = require('joi');
const Boom = require('boom');
const bcrypt = require('bcrypt');

module.exports = {
  method: 'POST',
  path: '/login',
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
    let password = request.payload.password;

    let promise = request.db.select('*').from('users').where({ username: username }).first()
    .then((user) => {
      console.log(user);

      // validate password
      if (!bcrypt.compareSync(password, user.password)) {
        return Boom.badRequest('Invalid Credentials');
      }

      let cachedUser = { username: username };
      return new Promise((resolve, reject) => {
        request.server.app.cache.set('user:' + user.id, cachedUser, 0, (err) => {
          if (err) { return reject(err); }
          request.cookieAuth.set({ sid: 'user:' + user.id });
          return resolve();
        });
      });
    })
    .catch((err) => { return err; });
    return reply(promise);
  }
}
