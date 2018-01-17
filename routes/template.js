const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/template',
  config: { auth: false },
  handler: async (request, h) => {
    /// pass in other layouts using { layout: 'layoutName' } as third parameter
    return h.view('test', { title: 'test title' });
  }
}
