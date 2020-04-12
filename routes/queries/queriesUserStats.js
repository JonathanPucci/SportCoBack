var db = require("../../dbconnection").db;

// add query functions
function getAllUserStats(req, res, next) {
  db
    .any('select * from UserStats')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL UserStats"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUserStats(req, res, next) {
  var userid = parseInt(req.params.id);
  db
    .one('select * from UserStats where user_id = $1', userid)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: {
          basket : {
            created : data.basket_created,
            joined : data.basket_joined,
            level : data.basket_level,
          },
          tennis : {
            created : data.tennis_created,
            joined : data.tennis_joined,
            level : data.tennis_level,
          },
          soccer : {
            created : data.soccer_created,
            joined : data.soccer_joined,
            level : data.soccer_level,
          },
          futsal : {
            created : data.futsal_created,
            joined : data.futsal_joined,
            level : data.futsal_level,
          },
          beachvolley : {
            created : data.beachvolley_created,
            joined : data.beachvolley_joined,
            level : data.beachvolley_level,
          },
          volley : {
            created : data.volley_created,
            joined : data.volley_joined,
            level : data.volley_level,
          },
          workout : {
            created : data.workout_created,
            joined : data.workout_joined,
            level : data.workout_level,
          },
          running : {
            created : data.running_created,
            joined : data.running_joined,
            level : data.running_level,
          }
        },
        message: "Retrieved ONE UserStat"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUserStats(req, res, next) {
  return db
    .none('insert into UserStats(user_id) values(${user_id})', req.body)
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Inserted one UserStat"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUserStats(req, res, next) {
  db
    .none('update UserStats set $1~=($1~+1) where user_id = $2', [
      req.body.statToUpdate,
      req.body.user_id
    ])
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated UserStat"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUserLevel(req, res, next) {
  db
    .none("update UserStats set $1~= $2 where user_id = $3", [
      req.body.sport_level,
      req.body.level,
      req.body.user_id
    ])
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated UserStat"
      });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function removeUserStats(req, res, next) {
  var userStat = JSON.parse(req.params.userStat);

  db
    .result('delete from UserStats where user_id= ${user_id}', userStat)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} UserStat`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllUserStats: getAllUserStats,
  getSingleUserStats: getSingleUserStats,
  createUserStats: createUserStats,
  updateUserStats: updateUserStats,
  updateUserLevel:updateUserLevel,
  removeUserStats: removeUserStats
};
