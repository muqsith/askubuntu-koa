'use strict';

var path = require('path');
var routesloader = require('./routes-loader');
var mongo = require('koa-mongo');
var config = require('config');
const winstonKoaLogger = require('winston-koa-logger');
// Initialize logger
const logger = require('./logger');
var favicon = require('koa-favicon');

var rootdir = __dirname.substring(0,__dirname.lastIndexOf(path.sep));

var initapp = function(app)
{
    // Configure winston-koa-logger
    app.use(winstonKoaLogger(logger));

    // Configure mongodb
    app.use(mongo(config.get('mongodb')));

    // TODO : Configure Jade templates
    

    // Configure routes
    routesloader(app);

    // Configure static files
    const static_root = rootdir+'/public';
    var opts = {};
    app.use(require('koa-static')(static_root, opts));

    // Configure favicon
    app.use(favicon(rootdir + '/public/favicon.ico'));
}

module.exports = initapp;
