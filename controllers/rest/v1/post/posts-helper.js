var getPostById = function(mongo)
{
    return function *(id)
    {
        var cursor = mongo.collection('Posts').find({'Id':id});
        var doc = {};
        while(yield cursor.hasNext())
        {
            doc = yield cursor.next();
        }
        return doc;
    };
};

var getAssembledPost = function(mongo)
{
    return function *(postId)
    {
        var post = {};
        var postsCursor = mongo.collection('Posts').find({'Id':postId});
        while (yield postsCursor.hasNext())
        {
            post = yield postsCursor.next();
            var commentsCursor = mongo.collection('Comments')
                .find({'PostId':postId});
            var comments = [];
            while(yield commentsCursor.hasNext())
            {
                var comment = yield commentsCursor.next();
                comments.push(comment);
            }
            post.comments = comments;
            var postHistoryCursor = mongo.collection('PostHistory')
                .find({'PostId':postId});
            var postHistory = [];
            while(yield postHistoryCursor.hasNext())
            {
                var postHistoryObject = yield postHistoryCursor.next();
                postHistory.push(postHistoryObject);
            }
            post.postHistory = postHistory;
            var postLinksCursor = mongo.collection('PostLinks')
                .find({'PostId':postId});
            var postLinks = [];
            while (yield postLinksCursor.hasNext())
            {
                var postLink = yield postLinksCursor.next();
                postLinks.push(postLink);
            }
            post.postLinks = postLinks;
            var votesCursor = mongo.collection('Votes')
                .find({'PostId':postId});
            var votes = [];
            while (yield votesCursor.hasNext())
            {
                var vote = yield votesCursor.next();
                votes.push(vote);
            }
            post.votes = votes;
        }
        return post;
    };
};

var getAllPostsByPage = function(mongo)
{
    return function *(pageNumber, itemsInPage)
    {
        var result = {totalPosts:0, numberOfPages: 0,
        currentPage: pageNumber,
        itemsInPage: 0, result: []};
        if(pageNumber > 0 && itemsInPage > 0)
        {
            var docIds = yield mongo.collection('Posts')
                .aggregate([ { $match: { 'PostTypeId': { $eq : 1 }  } }
                    ,{ $sort: { 'LastActivityDate': -1 } }
                    , { $project: { '_id':1 } } ]).toArray();
            if(docIds && docIds.length)
            {
                var docsCount = docIds.length;
                result.totalPosts = docsCount;
                var lastPageDocs = docsCount % itemsInPage;
                var pages = ((docsCount - lastPageDocs) / itemsInPage) + 1;
                result.numberOfPages = pages;
                var fromDocNumber = (itemsInPage * (pageNumber -1));
                var tillDocNumber = ( (itemsInPage * (pageNumber))
                    < (docIds.length - 1) )
                    ? (itemsInPage * (pageNumber)) : (docIds.length - 1);

                var selectedDocIds = [];
                for(var i = fromDocNumber; i < tillDocNumber; i += 1)
                {
                    selectedDocIds.push(docIds[i]['_id']);
                }
                result.result = yield mongo.collection('Posts')
                    .aggregate([
                        { $match: { '_id' : { '$in' : selectedDocIds }
                    , 'PostTypeId': { $eq : 1 }  } }
                    ,{$sort: { 'LastActivityDate': -1} }
                    ,{ $project: {'_id':1, 'Title':1, 'Score':1 }}
                ]).toArray();
                result.itemsInPage = result.result.length;
            }
        }
        return result;
    }
};

var getPostsBySearch = function(mongo)
{
    return function *(searchString)
    {
        var result = yield mongo.collection('Posts')
        .aggregate([ { $match: { $text : { $search : searchString }
            , 'PostTypeId': { $eq : 1 }  } }
        ,{$sort: { 'LastActivityDate': -1} }
        ,{ $project: {'_id':1, 'Title':1, 'Score':1 }} ]).toArray();

        return result;
    }
};

module.exports = function(mongo)
{
    'use strict';
    return {
        getPostById : getPostById(mongo),
        getAssembledPost : getAssembledPost(mongo),
        getAllPostsByPage : getAllPostsByPage(mongo),
        getPostsBySearch : getPostsBySearch(mongo)
    };
};
