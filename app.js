'use strict';

const koa = require('koa');
const app = koa();

// Initialize app with common aspects such as logging, routes, database etc.
var initapp = require('./lib/init-app');
initapp(app);

module.exports = app;
