'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

const PORT = process.env.PORT || 9000;
server.connection({ port: PORT, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    return reply('Hello, world!');
  }
});


server.start((err) => {
  if (err) { throw err; }
  console.log(`Server running at: ${server.info.uri}`);
});
