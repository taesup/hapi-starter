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
const authOptions = config.auth;
const logOptions = config.logging;


// SERVER INSTANTIATION AND CONFIGURATION

const files = { relativeTo: path.join(__dirname, 'public') }; // deliver files from public dir
const server = new Hapi.Server({
  port: config.port,
  host: config.address,
  tls: config.tls,
  routes: {
    files,
    cors: { // TODO remove cors on prod
      origin: ['*'],
      credentials: true
    }
  },
  cache: {
    engine: Redis,
    host: '127.0.0.1',
    partition: 'cache'
  }
});


// REQUEST DECORATIONS AND METHODS

// db decoration
server.decorate('request', 'db', db);


// BOOTSTRAP AND START SERVER

async function bootstrap () {
  // static file serving
  await server.register({ plugin: Inert });

  // HTML Templating
  await server.register({ plugin: Vision });
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

  // logging
  await server.register({ plugin: Good, options: logOptions });

  // session caching (30 days)
  // TODO: double check cache expiresIn - use redis instead to persist session forever
  server.app.cache = server.cache({ segment: 'sessions', expiresIn: 2147483647 });

  // auth strategy
  await server.register({ plugin: Auth });
  authOptions(server);

  // routes (must come after inert)
  server.route(routes);

  // start server and print
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

try { bootstrap(); }
catch (err) { console.log('Failed to bootstrap server: ', err); }
