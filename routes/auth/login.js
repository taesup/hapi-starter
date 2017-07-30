const Joi = require('joi');

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
    let promise = request.models.User.findUsername(username)
    .then((user) => {
      console.log(user);

      // validate password

      return new Promise((resolve, reject) => {
        request.server.app.cache.set('user:' + user.id, { account: user }, 0, (err) => {
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
