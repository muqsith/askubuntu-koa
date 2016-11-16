'use strict';

var router = require('koa-router')();

router.get('/', function *(next) {
  //ctx.render('index', {foo:"bar"});
});

router.allowedMethodsObject = {};

module.exports = router;
