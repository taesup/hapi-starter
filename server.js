'use strict';
const PORT = process.env.PORT || 9000;

const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');

const db = require('./database');
const routes = require('./routes');
const models = require('./models');
const logOptions = require('./configs/logging');

const server = new Hapi.Server();
server.connection({ port: PORT, host: 'localhost' });

// static file serving
server.register(Inert)
// logging
.then(() => { return server.register({ register: Good, options: logOptions }); })
// db decoration
.then(() => { return server.decorate('request', 'db', db); })
// models decoration
.then(() => { return server.decorate('request', 'models', models); })
// routes (must come after inert)
.then(() => { return server.route(routes); })
// start server
.then(() => { return server.start(); })
// print server started
.then(() => { console.log(`Server running at: ${server.info.uri}`); })
// catch all error handling
.catch((err) => { throw err; });

// TODO list:
// log to file
// user auth (cookie)
// login, logout, register
// user auth restricted routes
// templating (handlebars)
