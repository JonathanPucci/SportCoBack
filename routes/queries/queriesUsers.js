var db = require("../../dbconnection").db;

// add query functions
function getAllUsers(req, res, next) {
  db
    .any('select * from Users')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Users"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUser(req, res, next) {
  var userId = parseInt(req.params.id);
  db
    .one('select * from Users where user_id = $1', userId)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE User"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUserNotifications(req, res, next) {
  var userId = parseInt(req.params.id);
  db
    .any('select * from userpushnotifications INNER JOIN Users ON userpushnotifications.sender_id = users.user_id where userpushnotifications.user_id = $1', userId)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved User notifs"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleUserByEmail(req, res, next) {
  var email = req.params.id;
  db
    .one('select * from Users where email = $1', email)
    .then(function (data) {
      db
        .any('select * from Events where host_id = $1', data.user_id)
        .then(function (eventsData) {
          db
            .any('select * from UserFriends INNER JOIN Users ON UserFriends.friend_id = Users.user_id where UserFriends.user_id = $1', data.user_id)
            .then(function (friendsData) {
              db
                .any('select * from eventparticipants INNER JOIN events ON eventparticipants.event_id = events.event_id where eventparticipants.user_id = $1 and events.host_id != $1', data.user_id)
                .then(function (joinedData) {
                  db
                    .any('select * from teammembers INNER JOIN teams ON teams.team_id = teammembers.team_id where teammembers.member_id = $1', data.user_id)
                    .then(function (teamsData) {
                      db
                        .any('select * from waitingteammembers INNER JOIN teams  ON teams.team_id = waitingteammembers.team_id where waitingteammembers.member_id = $1', data.user_id)
                        .then(function (teamsWaitingData) {
                          let result = data;
                          result['eventsCreated'] = eventsData;
                          result['eventsJoined'] = joinedData;
                          result['userFriends'] = friendsData;
                          result['userTeams'] = teamsData;
                          result['userTeamsWaiting'] = teamsWaitingData;
                          res.status(200).json({
                            status: "success",
                            data: result,
                            message: "Retrieved ONE User"
                          });
                        });
                    });
                });
            });
        })
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function createUser(req, res, next) {
  return db
    .one('insert into Users(user_id,user_name,email,photo_url,photo_to_use) values(DEFAULT,${user_name},${email},${photo_url},${photo_to_use}) RETURNING user_id', req.body)
    .then((data) => {
      res.status(200).json({
        status: "success",
        message: "Inserted one User",
        data: {
          user_id: data.user_id,
        },
      });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function updateUser(req, res, next) {
  let request = 'update Users set ';

  if (req.body.user_name)
    request += "user_name='" + req.body.user_name + "',";
  if (req.body.user_age)
    request += "user_age='" + req.body.user_age + "',";
  if (req.body.photo_url)
    request += "photo_url='" + req.body.photo_url + "',";
  if (req.body.photo_url_s3)
    request += "photo_url_s3='" + req.body.photo_url_s3 + "',";
  if (req.body.photo_to_use)
    request += "photo_to_use='" + req.body.photo_to_use + "',";
  if (req.body.user_push_token)
    request += "user_push_token='" + req.body.user_push_token + "',";
  if (req.body.user_title)
    request += "user_title='" + req.body.user_title + "',";
  if (req.body.user_description)
    request += "user_description='" + req.body.user_description + "',";
  if (req.body.auto_save_to_calendar != undefined)
    request += "auto_save_to_calendar=" + (req.body.auto_save_to_calendar ? "true," : "false,");
  if (req.body.email)
    request += "email='" + req.body.email + "',";
  request = request.slice(0, -1);
  request += ' where user_id =' + req.body.user_id;
  db
    .none(request)
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated User"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateUserByEmail(req, res, next) {
  let request = 'update Users set ';
  let requestInit = 'update Users set ';

  if (req.body.user_name)
    request += "user_name='" + req.body.user_name + "',";
  if (req.body.user_age)
    request += "user_age='" + req.body.user_age + "',";
  if (req.body.photo_url)
    request += "photo_url='" + req.body.photo_url + "',";
  if (req.body.photo_url_s3)
    request += "photo_url_s3='" + req.body.photo_url_s3 + "',";
  if (req.body.photo_to_use)
    request += "photo_to_use='" + req.body.photo_to_use + "',";
  if (req.body.user_push_token)
    request += "user_push_token='" + req.body.user_push_token + "',";
  if (req.body.user_title)
    request += "user_title='" + req.body.user_title + "',";
  if (req.body.user_description)
    request += "user_description='" + req.body.user_description + "',";
  if (req.body.auto_save_to_calendar != undefined)
    request += "auto_save_to_calendar=" + (req.body.auto_save_to_calendar ? "true," : "false,");
  if (request != requestInit) {
    request = request.slice(0, -1);
    request += " where email ='" + req.body.email + "'";
    db
      .none(request)
      .then(function () {
        res.status(200).json({
          status: "success",
          message: "Updated User"
        });
      })
      .catch(function (err) {
        return next(err);
      });
  } else {
    res.status(200).json({
      status: "success",
      message: "Well.. nothing to update"
    });
  }
}

function removeUser(req, res, next) {
  var user = JSON.parse(req.params.user);

  db
    .result('delete from Users where user_id= ${user_id}', user)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} User`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllUsers: getAllUsers,
  getSingleUser: getSingleUser,
  getSingleUserNotifications: getSingleUserNotifications,
  getSingleUserByEmail: getSingleUserByEmail,
  createUser: createUser,
  updateUser: updateUser,
  updateUserByEmail: updateUserByEmail,
  removeUser: removeUser
};
