var koa = require('koa');
var app = koa();

var routesloader = require('./lib/routes-loader');
routesloader(app, 'controllers');


module.exports = app;
