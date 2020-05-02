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
    .any('select * from userpushnotifications where user_id = $1', userId)
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
            .any('select * from eventparticipants INNER JOIN events ON eventparticipants.event_id = events.event_id where eventparticipants.user_id = $1 and events.host_id != $1', data.user_id)
            .then(function (joinedData) {
              let result = data;
              result['eventsCreated'] = eventsData;
              result['eventsJoined'] = joinedData;
              res.status(200).json({
                status: "success",
                data: result,
                message: "Retrieved ONE User"
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
    .one('insert into Users(user_id,user_name,email,photo_url) values(DEFAULT,${user_name},${email},${photo_url}) RETURNING user_id', req.body)
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
  if (req.body.photo_url)
    request += "photo_url='" + req.body.photo_url + "',";
  if (req.body.user_push_token)
    request += "user_push_token='" + req.body.user_push_token + "',";
  if (req.body.user_title)
    request += "user_title='" + req.body.user_title + "',";
  if (req.body.user_description)
    request += "user_description='" + req.body.user_description + "',";
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
  db
    .none('update Users set user_name=$1, photo_url=$3 where email=$2', [
      req.body.user_name,
      req.body.email,
      req.body.photo_url
    ])
    .then(function (data) {
      res.status(200).json({
        status: "success",
        message: "Updated User"
      });
    })
    .catch(function (err) {
      return next(err);
    });
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
