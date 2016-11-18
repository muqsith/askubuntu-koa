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

router.get('allposts','/all', function *(next) {
  var pageNumber = this.query.page;
  var itemsInPage = this.query.pagesize;
  var postsHelper = PostsHelper(this.mongo);
  this.body = yield postsHelper.getAllPostsByPage(pageNumber, itemsInPage);
});

router.get('search','/search', function *(next) {
  var searchString = this.query.q;
  var postsHelper = PostsHelper(this.mongo);
  this.body = yield postsHelper.getPostsBySearch(searchString);
});

router.allowedMethodsObject = {};

module.exports = router;
