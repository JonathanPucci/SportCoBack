var db = require("../../dbconnection").db;

// add query functions
function getAllEventParticipants(req, res, next) {
  db
    .any('select * from EventParticipants')
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
    .one('select * from EventParticipants where event_id = $1', eventID)
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
  var user_id = parseInt(req.params.id);
  db
    .one('select * from EventParticipants where user_id = $1', user_id)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved events of participant" + user_id
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createEventParticipant(req, res, next) {
  db
    .none(
      'insert into EventParticipants(event_id,user_id)' +
        "values(${event_id},${user_id})",
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
  let eventparticipant = JSON.parse(req.params.eventparticipant);
  db
    .result(
      'delete from EventParticipants where user_id= ${user_id} AND event_id= ${event_id}',
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
