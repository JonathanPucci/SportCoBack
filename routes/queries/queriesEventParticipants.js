var db = require("../../dbconnection").db;

// add query functions
function getAllEventParticipants(req, res, next) {
  db
    .any('select * from "EventParticipants"')
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL EventParticipants"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getParticipantsOfEvent(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from "EventParticipants" where "Event_ID" = $1', eventID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved participants of event" + eventID
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getEventsOfParticipant(req, res, next) {
  var User_ID = parseInt(req.params.id);
  db
    .one('select * from "EventParticipants" where "User_ID" = $1', User_ID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved events of participant" + User_ID
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createEventParticipant(req, res, next) {
  db
    .none(
      'insert into "EventParticipants"("Event_ID","User_ID")' +
        "values(${Event_ID},${User_ID})",
      req.body
    )
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Inserted one EventParticipant"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeEventParticipant(req, res, next) {
  console.log(JSON.stringify(req.params.eventparticipant))
  let eventparticipant = JSON.parse(req.params.eventparticipant);
  db
    .result(
      'delete from "EventParticipants" where "User_ID"= ${User_ID} AND "Event_ID"= ${Event_ID}',
      eventparticipant
    )
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} EventParticipant`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllEventParticipants: getAllEventParticipants,
  createEventParticipant: createEventParticipant,
  removeEventParticipant: removeEventParticipant,
  getParticipantsOfEvent: getParticipantsOfEvent,
  getEventsOfParticipant : getEventsOfParticipant
};
