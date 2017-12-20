const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/template',
  config: { auth: false },
  handler: (request, reply) => {
    /// pass in other layouts using { layout: 'layoutName' } as third parameter
    return reply.view('test', { title: 'test title' });
  }
}
