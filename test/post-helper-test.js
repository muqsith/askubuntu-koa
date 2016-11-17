'use strict';

var assert = require('assert');
require('co-mocha'); // load module to test generator functions
var PostsHelper = require('../controllers/rest/v1/post/posts-helper');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;

describe('Posts - Test', function(){

    var postsHelper = undefined;
    var mdb = undefined;

    before(function *(){
        mdb = yield MongoClient.connect(config.get('mongodb-url'));
        postsHelper = PostsHelper(mdb);
    });

    it("should get one post", function *(){
        var doc = yield postsHelper.getPostById(10);
        assert.equal(parseInt(doc['Id']), 10);
    });

    it("should get one fully assembled post", function *(){
        var doc = yield postsHelper.getAssembledPost(10);
        assert.equal(parseInt(doc['Id']), 10);
    });

    after(function *(){
        mdb.close();
    });
});
