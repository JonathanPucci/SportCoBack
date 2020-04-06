var db = require("../../dbconnection").db;
var sendNotifications = require("../../notifications/notifications").sendNotifications;

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
    latitude_min: (areaSelected.latitude - areaSelected.latitudeDelta / 2).toString(),
    latitude_max: (areaSelected.latitude + areaSelected.latitudeDelta / 2).toString(),
    longitude_min: (areaSelected.longitude - areaSelected.longitudeDelta / 2).toString(),
    longitude_max: (areaSelected.longitude + areaSelected.longitudeDelta / 2).toString(),
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
            .any('select * from EventParticipants where event_id = $1', eventID)
            .then(function (participantsData) {
              db
                .one('select * from Spots where spot_id = $1', eventsData.spot_id)
                .then(function (spotsData) {
                  res.status(200).json({
                    status: "success",
                    data: {
                      event: eventsData,
                      host: hostData,
                      participants: participantsData,
                      spot: spotsData
                    },
                    message: "Retrieved ONE Event"
                  });
                })
            })
        })
    })
    .catch(function (err) {
      return next(err);
    });
}

function createEvent(req, res, next) {
  db
    .any(
      'insert into Events( event_id,description, photo, date, host_id, spot_id, participants_min, participants_max, sport)' +
      "values( DEFAULT, ${ description}, ${ photo}, ${ date}, ${ host_id}, ${ spot_id}, ${ participants_min}, ${ participants_max}, ${ sport}) RETURNING event_id",
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
      'update Events set description=${ description}, photo=${ photo}, date=${ date}, host_id=${ host_id}, spot_id=${ spot_id}, participants_min=${ participants_min}, participants_max=${ participants_max}, sport=${ sport} where event_id=${event_id} ',
      req.body
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated Event"
      });
      db.any('select user_push_token from users INNER JOIN eventparticipants on eventparticipants.user_id = Users.user_id where event_id = ${event_id}', req.body).then((data) => {
        let participantTokens = [];

        for (let index = 0; index < data.length; index++) {
          const token = data[index].user_push_token;
          participantTokens.push(token);
        }
        let event_id = req.body.event_id;
        sendNotifications(participantTokens, 'EVENT_CHANGED', {event_id : event_id});

      })
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeEvent(req, res, next) {
  var event = JSON.parse(req.params.event);
  db
    .result('delete from Events where event_id = ${event_id}', event)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} Event`
      });
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
