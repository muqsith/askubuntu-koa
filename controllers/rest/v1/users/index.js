'use strict';

var router = require('koa-router')();
var UsersHelper = require('./users-helper');

router.get('user','/:id', function *(next) {
  var id = parseInt(this.params.id);
  var usersHelper = UsersHelper(this.mongo);
  this.body = yield usersHelper.getUserById(id);
});

router.get('allusers','/all', function *(next) {
  var pageNumber = this.query.page;
  var itemsInPage = this.query.pagesize;
  var usersHelper = UsersHelper(this.mongo);
  this.body = yield usersHelper.getAllUsersByPage(pageNumber, itemsInPage);
});

router.get('search','/search', function *(next) {
  var searchString = this.query.q;
  var usersHelper = UsersHelper(this.mongo);
  this.body = yield usersHelper.getUsersBySearch(searchString);
});

router.allowedMethodsObject = {};

module.exports = router;
