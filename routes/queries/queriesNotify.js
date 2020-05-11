var db = require("../../dbconnection").db;
var sendNotifToUserWithToken = require("../../notifications/firebaseNotifications").sendNotifToUserWithToken;



function notifyUser(req, res, next) {

  let user = { user_id: req.body.user_id };
  let notif = {
    message_type: req.body.notif_message_type,
    data_type: req.body.notif_data_type,
    data_value: req.body.notif_data_value.toString(),
    data_value2: req.body.sender_photo_url,
    sender_id: req.body.sender_id.toString()
  }
  let token = req.body.user_push_token;
  sendNotifToUserWithToken(notif, user, token);
  res.status(200).json({
    status: "success",
    message: "Notif sent to User"
  });
}


function notifyTeam(req, res, next) {
  let team_id = req.body.team_id;
  let sender_id = req.body.sender_id;
  db
    .any('select * from TeamMembers INNER JOIN Users ON TeamMembers.member_id = Users.user_id where team_id = ' + team_id + ' and member_id !=' + sender_id)
    .then(function (data) {

      for (let index = 0; index < data.length; index++) {
        let user = { user_id: data[index].user_id };
        let notif = {
          message_type: req.body.notif_message_type,
          data_type: req.body.notif_data_type,
          data_value: req.body.notif_data_value.toString(),
          data_value2: req.body.sender_photo_url,
          sender_id: sender_id.toString()
        }
        let token = data[index].user_push_token;
        sendNotifToUserWithToken(notif, user, token);
      }
      res.status(200).json({
        status: "success",
        data: data,
        message: "Notif sent to Team"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  notifyUser: notifyUser,
  notifyTeam: notifyTeam,
};
