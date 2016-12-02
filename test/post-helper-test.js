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
        var doc = yield postsHelper.getPostById(47);
        assert.equal(parseInt(doc['Id']), 47);
    });

    it("should get one fully assembled post", function *(){
        this.timeout(5 * 1000);
        var doc = yield postsHelper.getAssembledPost(47);
        assert.equal(parseInt(doc['Id']), 47);
    });

    it("should get posts by page number and items per page", function *(){
        this.timeout(3 * 1000);
        var result = yield postsHelper.getAllPostsByPage(1,30);
        console.log('\n\t', 'Total posts: ', result.totalPosts,
        ', Number of pages: ', result.numberOfPages, ', Current page: ',
        result.currentPage, ', Items in page: ', result.itemsInPage);
        assert.equal(result.itemsInPage, 30);
    });

    it("should get the search result", function *(){
        var result = yield postsHelper.getPostsBySearch("Xenial");
        console.log(result.length);
        assert.notEqual(result.length, 0);
    });

    after(function *(){
        mdb.close();
    });
});
