var db = require("../../dbconnection").db;
var sendNotifications = require("../../notifications/notifications").sendNotifications;
var sendNotifToUserWithToken = require("../../notifications/firebaseNotifications").sendNotifToUserWithToken;

// add query functions
function getAllEvents(req, res, next) {
  db
    .any('select * from Events')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Events"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllEventsInArea(req, res, next) {
  let areaSelected = req.body;
  let area = {
    latitude_min: (areaSelected.latitude - (areaSelected.latitudeDelta / 2)),
    latitude_max: (areaSelected.latitude + (areaSelected.latitudeDelta / 2)),
    longitude_min: (areaSelected.longitude - (areaSelected.latitudeDelta / 2)),
    longitude_max: (areaSelected.longitude + (areaSelected.latitudeDelta / 2)),
  }
  db
    .any("select * from events INNER JOIN spots ON spots.spot_id = events.spot_id WHERE spots.spot_longitude BETWEEN ${longitude_min} AND ${longitude_max} AND spots.spot_latitude BETWEEN ${latitude_min} AND ${latitude_max};", area)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Events"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleEvent(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from Events where event_id = $1', eventID)
    .then(function (eventsData) {
      db
        .one('select * from Users where User_ID = $1', eventsData.host_id)
        .then(function (hostData) {
          db
            .any('select * from EventParticipants INNER JOIN Users ON  EventParticipants.user_id = Users.user_id INNER JOIN Userstats ON  EventParticipants.user_id = Userstats.user_id where EventParticipants.event_id = $1', eventID)
            .then(function (participantsData) {
              db
                .any('select * from EventComments INNER JOIN Users ON  EventComments.user_id = Users.user_id where event_id = $1', eventID)
                .then(function (commentsData) {
                  db
                    .one('select * from Spots where spot_id = $1', eventsData.spot_id)
                    .then(function (spotsData) {
                      res.status(200).json({
                        status: "success",
                        data: {
                          event: eventsData,
                          host: hostData,
                          participants: participantsData,
                          comments: commentsData,
                          spot: spotsData
                        },
                        message: "Retrieved ONE Event"
                      });
                    })
                })
            })
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function createEvent(req, res, next) {
  console.log(req.body);
  db
    .any(
      'insert into Events( event_id,description, date, host_id, spot_id, participants_min, participants_max, sport,sport_level, visibility)' +
      "values( DEFAULT, ${description}, ${date}, ${host_id}, ${spot_id}, ${participants_min}, ${participants_max}, ${sport}, ${sport_level}, ${visibility}) RETURNING event_id",
      req.body
    )
    .then(function (data) {
      res.status(200).json({
        status: "success",
        message: "Inserted one Event",
        data: {
          event_id: data[0].event_id,
        },
      });
    })
    .catch(function (err) {
      console.log("==============ERROOOOOORRR=========");
      console.log(err);
      console.log("==============ERROOOOOORRR=========");
      return next(err);
    });
}

function updateEvent(req, res, next) {
  db
    .none(
      'update Events set description=${description}, photo=${photo}, date=${date}, host_id=${host_id}, spot_id=${spot_id}, participants_min=${participants_min}, participants_max=${participants_max}, sport=${sport}, sport_level=${sport_level}, visibility=${visibility} where event_id=${event_id} ',
      req.body
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated Event"
      });
      db.any('select users.user_id,user_push_token from users INNER JOIN eventparticipants on eventparticipants.user_id = Users.user_id where event_id = ${event_id}', req.body).then((data) => {
        for (let index = 0; index < data.length; index++) {
          // console.log(data[index]);
          //   participantNotifs.push({
          //     user_push_token: data[index].user_push_token,
          //     user_id: data[index].user_id,
          //     message_type: req.body.reason_for_update,
          //     data_type: req.body.data_name,
          //     data_value: req.body.event_id
          //   });
          if (data[index].user_id != req.body.host_id) {

            let user = { user_id: data[index].user_id };
            let notif = {
              message_type: req.body.reason_for_update,
              data_type: req.body.data_name,
              data_value: req.body.event_id
            }
            let token = data[index].user_push_token;
            sendNotifToUserWithToken(notif, user, token);
          }
        }
        // sendNotifications(participantNotifs);

      })
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeEvent(req, res, next) {
  var event = JSON.parse(req.params.event);
  db.any('select users.user_id,user_push_token from users INNER JOIN eventparticipants on eventparticipants.user_id = Users.user_id where event_id = ${event_id}', event)
    .then((data) => {
      let participantNotifs = [];
      for (let index = 0; index < data.length; index++) {
        if (data[index].user_id != event.host_id) {
          let user = { user_id: data[index].user_id };
          let notif = {
            message_type: event.reason_for_update,
            data_type: event.data_name,
            data_value: event.event_id
          }
          let token = data[index].user_push_token;
          sendNotifToUserWithToken(notif, user, token);
        }
      }
      db
        .result('delete from Events where event_id = ${event_id}', event)
        .then(function (result) {
          /* jshint ignore:start */
          res.status(200).json({
            status: "success",
            message: `Removed ${result.rowCount} Event`
          });
          sendNotifications(participantNotifs);
        })
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllEvents: getAllEvents,
  getSingleEvent: getSingleEvent,
  getAllEventsInArea: getAllEventsInArea,
  createEvent: createEvent,
  updateEvent: updateEvent,
  removeEvent: removeEvent
};
