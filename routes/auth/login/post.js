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
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) { return h.redirect('/'); }

    let username = request.payload.username;
    let password = request.payload.password;

    // get user from db
    let user = await request.db.select('*').from('users').where({ username: username }).first()

    // validate password
    if (!bcrypt.compareSync(password, user.password)) {
      return Boom.badRequest('Invalid Credentials');
    }

    // create session for user
    let cachedUser = { username: username };
    await request.server.app.cache.set('user:' + user.id, cachedUser, 0);
    request.cookieAuth.set({ sid: 'user:' + user.id });

    // return status 200 okay
    return h.response().code(200);
  }
}
