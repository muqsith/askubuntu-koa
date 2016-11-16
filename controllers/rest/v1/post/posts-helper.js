var getPostById = function *(mongo, id)
{
    var cursor = mongo.collection('Posts').find({'Id':id});
    var docs = [];
    while(yield cursor.hasNext())
    {
        var doc = yield cursor.next();
        docs.push(doc);
    }
    return docs;
}

var getAssembledPost = function *(mongo, postId)
{
    var post = {};
    var postsCursor = mongo.collection('Posts').find({'Id':postId});
    while (yield postsCursor.hasNext())
    {
        post = yield postsCursor.next();
        var commentsCursor = mongo.collection('Comments').find({'PostId':postId});
        var comments = [];
        while(yield commentsCursor.hasNext())
        {
            var comment = yield commentsCursor.next();
            comments.push(comment);
        }
        post.comments = comments;
        var postHistoryCursor = mongo.collection('PostHistory').find({'PostId':postId});
        var postHistory = [];
        while(yield postHistoryCursor.hasNext())
        {
            var postHistoryObject = yield postHistoryCursor.next();
            postHistory.push(postHistoryObject);
        }
        post.postHistory = postHistory;
        var postLinksCursor = mongo.collection('PostLinks').find({'PostId':postId});
        var postLinks = [];
        while (yield postLinksCursor.hasNext())
        {
            var postLink = yield postLinksCursor.next();
            postLinks.push(postLink);
        }
        post.postLinks = postLinks;
        var votesCursor = mongo.collection('Votes').find({'PostId':postId});
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

var posts_helper = {
    getPostById : getPostById,
    getAssembledPost : getAssembledPost
};

module.exports = posts_helper;
