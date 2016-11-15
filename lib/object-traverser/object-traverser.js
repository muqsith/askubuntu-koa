var array_traverser = require('./objects-array-traverser.js');
var path = require('path');

var defaultCriteria = function(o)
{
    return (typeof o === 'number' || typeof o === 'string');
};

var criteria = defaultCriteria;

var createTraverser = function(func)
{
    return function(o, previousKey)
    {
        traverser(o, previousKey, func);
    };
};

var traverser = function(o, previousKey, func)
{
    if(o && typeof o === 'object' && !criteria(o))
    {
        var keys = Object.getOwnPropertyNames(o);
        if(keys && keys.length)
        {
            var objects = keys.map(function(k){ return {'name':previousKey+path.sep+k, 'value':o[k]}; });
            var f = createTraverser(func);
            array_traverser(objects, f);
        }
    }
    if(o && criteria(o))
    {
        func(previousKey, o);
    }
};

var traverse = function(o, c)
{
    if(c)
    {
        criteria = c;
    }
    var m = {};
    var createMap = function(key, value)
    {
        m[key] = value;
    };

    var t = createTraverser(createMap);
    t(o,'');
    return m;
};

module.exports = traverse;
