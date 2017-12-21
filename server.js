// vendor modules
const path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const Redis = require('catbox-redis');
const Handlebars = require('handlebars');
const Auth = require('hapi-auth-cookie');

// local modules
const db = require('./database');
const routes = require('./routes');
const config = require('./configs');

// bootstrap server
const server = new Hapi.Server();
const files = { relativeTo: path.join(__dirname, 'public') }; // deliver files from public dir
server.connection({
  port: config.port,
  host: config.address,
  routes: { files },
  cache: [{
    engine: Redis,
    host: '127.0.0.1',
    partition: 'cache'
  }]
});

// static file serving
server.register(Inert)
.then(() => {
  return server.register(Vision)
  .then(() => {
    server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: './templates',
        layout: true,
        layoutPath: './templates/layout',
        partialsPath: './templates/partials',
        helpersPath: './templates/helpers',
        isCached: false
    });
  })
})
// logging
.then(() => { return server.register({ register: Good, options: config.logging }); })
// db decoration
.then(() => { return server.decorate('request', 'db', db); })
// session caching (30 days)
// TODO: double check cache expiresIn - use redis instead to persist session forever
.then(() => { server.app.cache = server.cache({ segment: 'sessions', expiresIn: 2147483647 }); })
// auth strategy
.then(() => {
  return server.register({ register: Auth })
  .then(() => { config.auth(server); });
})
// routes (must come after inert)
.then(() => { return server.route(routes); })
// start server
.then(() => { return server.start(); })
// print server started
.then(() => { console.log(`Server running at: ${server.info.uri}`); })
// catch all error handling
.catch((err) => { throw err; });
