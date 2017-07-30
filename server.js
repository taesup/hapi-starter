'use strict';

const Hapi = require('hapi');
const inert = require('inert');
const server = new Hapi.Server();

const PORT = process.env.PORT || 9000;
server.connection({ port: PORT, host: 'localhost' });

const routes = require('./routes');

// static file serving
server.register(inert)
// routes (must come after inert)
.then(() => { server.route(routes); })
// start server
.then(() => {
  server.start((err) => {
    if (err) { throw err; }
    console.log(`Server running at: ${server.info.uri}`);
  });
});
