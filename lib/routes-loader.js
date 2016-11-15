var path = require('path');
var KoaRouter = require('koa-router');
var requireDir = require('require-dir');
var traverser = require('./object-traverser/object-traverser.js');

var criteria = function(o)
{
    return (o instanceof KoaRouter);
};

var routesloader = function(app, router_dir)
{
    router_dir = '../'+router_dir;
    var dir = requireDir(router_dir, {recurse: true});
    var m = traverser(dir, criteria);

    if(m && typeof m === 'object')
    {
        for(var key in m)
        {
            var r = m[key];
            var a = key.split(path.sep);
            a.pop();
            var rPath = a.join(path.sep);
            r.prefix(rPath);
            app.use(r.routes());
            app.use(r.allowedMethods(r.allowedMethodsObject));
        }
    }

};

module.exports = routesloader;
