var db = require("../../dbconnection").db;

// add query functions
function getAllUserFriends(req, res, next) {
  db
    .any('select * from UserFriends')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL UserFriends"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUserFriends(req, res, next) {
  var userid = parseInt(req.params.id);
  db
    .one('select * from UserFriends INNER JOIN Users ON UserFriends.friend_id == Users.user_id where UserFriends.user_id = $1', userid)
    .then(function (data) {
      console.log("===DataFriends=====");
      console.log(data);
      res.status(200).json({
        status: "success",
        data: {
          data
        },
        message: "Retrieved ONE UserFriend"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUserFriends(req, res, next) {
  return db
    .none('insert into UserFriends(user_id,friend_id) values(${user_id},${friend_id})', req.body)
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Inserted one UserFriend"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}


function removeUserFriends(req, res, next) {
  var userfriend = JSON.parse(req.params.userfriend);
  
  let DBrequest = 'delete from userfriends where user_id= '+userfriend.user_id+' and friend_id='+userfriend.friend_id;
  db
    .result(DBrequest)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} UserFriend`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllUserFriends: getAllUserFriends,
  getSingleUserFriends: getSingleUserFriends,
  createUserFriends: createUserFriends,
  removeUserFriends: removeUserFriends
};
