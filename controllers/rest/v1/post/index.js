'use strict';

var router = require('koa-router')();
var PostsHelper = require('./posts-helper');

router.get('post','/:id', function *(next) {
  var id = parseInt(this.params.id);
  var postsHelper = PostsHelper(this.mongo);
  this.body = yield postsHelper.getPostById(id);
});

router.get('assembledpost','/assembled/:id', function *(next) {
  var id = parseInt(this.params.id);
  var postsHelper = PostsHelper(this.mongo);
  this.body = yield postsHelper.getAssembledPost(id);
});

router.allowedMethodsObject = {};

module.exports = router;
