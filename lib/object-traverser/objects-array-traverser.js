
var f = function(arr)
{
    var p = function(i, func)
    {
        if(arr[i-1] !== undefined)
        {
            func(arr[i].value, arr[i].name);
            return ( p((i-1), func) );
        }
        else
        {
            func(arr[i].value, arr[i].name);
            return arr[i];
        }
    };
    return p;
};


var array_traverser = function(a, func)
{
    var g = f(a);
    g(a.length-1, func);
};

module.exports = array_traverser;
