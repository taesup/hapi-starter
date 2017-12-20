const path = require('path');

module.exports = {
  method: 'GET',
  path: '/{param*}',
  config: { auth: false },
  handler: {
    directory: {
      path: '.',
      index: true
    }
  }
}
