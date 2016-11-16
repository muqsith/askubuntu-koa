'use strict';

var router = require('koa-router')();
var posts_helper = require('./posts-helper');

router.get('post','/:id', function *(next) {
  var id = parseInt(this.params.id);
  this.body = yield posts_helper.getPostById(this.mongo, id);
});

router.get('assembledpost','/assembled/:id', function *(next) {
  var id = parseInt(this.params.id);
  this.body = yield posts_helper.getAssembledPost(this.mongo, id);
});

router.allowedMethodsObject = {};

module.exports = router;
