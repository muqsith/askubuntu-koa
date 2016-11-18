'use strict';

var router = require('koa-router')();

router.get('/', function *(next) {
  this.render('index', {foo:"bar"});
});

router.allowedMethodsObject = {};

module.exports = router;
