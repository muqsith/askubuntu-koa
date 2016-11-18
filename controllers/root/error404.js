'use strict';

var router = require('koa-router')();

router.get('/error/404', function *(next) {
  this.render('error404', {error_number:"400", message:"Page not found"});
});

router.allowedMethodsObject = {};

module.exports = router;
