const PORT = process.env.PORT || 9000;

const path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const Auth = require('hapi-auth-cookie');

const db = require('./database');
const routes = require('./routes');
const models = require('./models');
const logOptions = require('./configs/logging');

const server = new Hapi.Server();
server.connection({ port: PORT, host: 'localhost', routes: { files: { relativeTo: path.join(__dirname, 'public')}}});

// static file serving
server.register(Inert)
// logging
.then(() => { return server.register({ register: Good, options: logOptions }); })
// db decoration
.then(() => { return server.decorate('request', 'db', db); })
// models decoration
.then(() => { return server.decorate('request', 'models', models); })
// session caching (30 days)
// TODO: double check cache expiresIn - use redis instead to persist session forever
.then(() => { server.app.cache = server.cache({ segment: 'sessions', expiresIn: 2147483647 }); })
// auth strategy
.then(() => {
  return server.register({ register: Auth })
  .then(() => {
    const cache = server.app.cache;
    server.auth.strategy('session', 'cookie', true, {
      password: 'password-should-be-32-characters',
      cookie: 'hapi-starter',
      ttl: 2147483647,
      keepAlive: true,
      clearInvalid: true,
      isSecure: false, // TODO: set this to true on PROD
      validateFunc: function (request, session, callback) {
        cache.get(session.sid, (err, cached) => {
          if (err) { return callback(err, false); }
          if (!cached) { return callback(null, false); }
          return callback(null, true, cached.account);
        });
      }
    });
  });
})
// routes (must come after inert)
.then(() => { return server.route(routes); })
// start server
.then(() => { return server.start(); })
// print server started
.then(() => { console.log(`Server running at: ${server.info.uri}`); })
// catch all error handling
.catch((err) => { throw err; });

// TODO list:
// UUIDs for model ids
// redis integration
// log to file
// templating (handlebars)
