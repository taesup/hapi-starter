'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Good = require('good');

const server = new Hapi.Server();
const PORT = process.env.PORT || 9000;
server.connection({ port: PORT, host: 'localhost' });

const routes = require('./routes');

// static file serving
server.register(Inert)
// logging
.then(() => {
  return server.register({
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ response: '*', log: '*' }]
        },
        { module: 'good-console' },
        'stdout']
      }
    }
  });
})
// routes (must come after inert)
.then(() => { return server.route(routes); })
// start server
.then(() => {
  server.start((err) => {
    if (err) { throw err; }
    console.log(`Server running at: ${server.info.uri}`);
  });
});
