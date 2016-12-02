var getUserById = function(mongo)
{
    return function *(id)
    {
        var cursor = mongo.collection('Users').find({'Id':id});
        var user = {};
        while(yield cursor.hasNext())
        {
            user = yield cursor.next();
        }
        return user;
    };
};

var getAllUsersByPage = function(mongo)
{
    return function *(pageNumber, usersInPage)
    {
        var result = {totalUsers:0, numberOfPages: 0,
        currentPage: pageNumber,
        usersInPage: 0, result: []};
        if(pageNumber > 0 && usersInPage > 0)
        {
            var userIds = yield mongo.collection('Users')
                .aggregate([ { $sort: { 'DisplayName': 1 } }
                    , { $project: { '_id':1 } } ]).toArray();
            if(userIds && userIds.length)
            {
                var usersCount = userIds.length;
                result.totalUsers = usersCount;
                var lastPageUsers = usersCount % usersInPage;
                var pages = ((usersCount - lastPageUsers) / usersInPage) + 1;
                result.numberOfPages = pages;
                var fromDocNumber = (usersInPage * (pageNumber -1));
                var tillDocNumber = ( (usersInPage * (pageNumber))
                    < (userIds.length - 1) )
                    ? (usersInPage * (pageNumber)) : (userIds.length - 1);

                var selectedUserIds = [];
                for(var i = fromDocNumber; i < tillDocNumber; i += 1)
                {
                    selectedUserIds.push(userIds[i]['_id']);
                }
                result.result = yield mongo.collection('Users')
                    .aggregate([
                        { $match: { '_id' : { '$in' : selectedUserIds } } }
                    ,{$sort: { 'DisplayName': 1} } ]).toArray();
                result.usersInPage = result.result.length;
            }
        }
        return result;
    }
};

var getUsersBySearch = function(mongo)
{
    return function *(searchString)
    {
        var result = yield mongo.collection('Users')
        .aggregate([ { $match: { $text : { $search : searchString } } }
        ,{$sort: { 'DisplayName': 1} } ]).toArray();
        return result;
    }
};

module.exports = function(mongo)
{
    'use strict';
    return {
        getUserById : getUserById(mongo),
        getAllUsersByPage : getAllUsersByPage(mongo),
        getUsersBySearch : getUsersBySearch(mongo)
    };
};
