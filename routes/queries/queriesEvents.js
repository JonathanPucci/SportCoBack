var db = require("../../dbconnection").db;

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
    latitude_min : (areaSelected.latitude -areaSelected.latitudeDelta/2).toString(),
    latitude_max : (areaSelected.latitude +areaSelected.latitudeDelta/2).toString(),
    longitude_min : (areaSelected.longitude -areaSelected.longitudeDelta/2).toString(),
    longitude_max : (areaSelected.longitude +areaSelected.longitudeDelta/2).toString(),
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
    .one('select * from Events where Event_ID = $1', eventID)
    .then(function (eventsData) {
      db
        .one('select * from Users where User_ID = $1', eventsData.host_id)
        .then(function (hostData) {
          db
            .any('select * from EventParticipants where Event_ID = $1', eventID)
            .then(function (participantsData) {
              db
                .one('select * from Spots where Spot_ID = $1', eventsData.spot_id)
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
    .none(
      'insert into Events( Description, Photo, Date, Host_ID, Spot_ID, Participants_min, Participants_max, Sport)' +
      "values( ${ Description}, ${ Photo}, ${ Date}, ${ Host_ID}, ${ Spot_ID}, ${ Participants_min}, ${ Participants_max}, ${ Sport})",
      req.body
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Inserted one Event"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateEvent(req, res, next) {
  db
    .none(
      'update Events set Description=${ Description}, Photo=${ Photo}, Date=${ Date}, Host_ID=${ Host_ID}, Spot_ID=${ Spot_ID}, Participants_min=${ Participants_min}, Participants_max=${ Participants_max}, Sport=${ Sport} where Event_ID=${Event_ID} ',
      req.body
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated Event"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeEvent(req, res, next) {
  var event = JSON.parse(req.params.event);

  db
    .result('delete from Events where Event_ID = ${Event_ID}', event)
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
  getAllEventsInArea : getAllEventsInArea,
  createEvent: createEvent,
  updateEvent: updateEvent,
  removeEvent: removeEvent
};