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
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) { return h.redirect('/'); }

    let username = request.payload.username;
    let password = bcrypt.hashSync(request.payload.password, 15);

    let user = await request.db('users').insert({
      username: username,
      password: password
    }).returning('*');

    // set user to first array index
    user = user[0];

    // create user sessoin
    let cachedUser = { username: username };
    await request.server.app.cache.set('user:' + user.id, cachedUser, 0);
    request.cookieAuth.set({ sid: 'user:' + user.id });

    // return status 200 okay
    return h.response().code(200);
  }
}
