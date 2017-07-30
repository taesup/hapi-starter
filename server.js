'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');

const routes = require('./routes');
const logOptions = require('./configs/logging');
const PORT = process.env.PORT || 9000;


const server = new Hapi.Server();
server.connection({ port: PORT, host: 'localhost' });

// static file serving
server.register(Inert)
// logging
.then(() => { return server.register({ register: Good, options: logOptions }); })
// routes (must come after inert)
.then(() => { return server.route(routes); })
// start server
.then(() => {
  server.start((err) => {
    if (err) { throw err; }
    console.log(`Server running at: ${server.info.uri}`);
  });
});
