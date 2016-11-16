'use strict';

var path = require('path');
var KoaRouter = require('koa-router');
var requireDir = require('require-dir');
var traverser = require('./object-traverser/object-traverser.js');
var config = require('config');
var log = require('./logger');

var criteria = function(o)
{
    return (o instanceof KoaRouter);
};

var routesloader = function(app)
{
    var router_dir = '../'+config.get('router.directory');
    var dir = requireDir(router_dir, {recurse: true});
    var m = traverser(dir, criteria);

    if(m && typeof m === 'object')
    {
        for(var key in m)
        {
            var r = m[key];
            var router_path = key.substring(0,key.lastIndexOf(path.sep));
            r.prefix(router_path);
            app.use(r.routes());
            app.use(r.allowedMethods(r.allowedMethodsObject));
            log.info('Associated route: %s', router_path);
        }
    }

};

module.exports = routesloader;
