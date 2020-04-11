var db = require("../../dbconnection").db;

// add query functions
function getAllEventComments(req, res, next) {
  db
    .any('select * from EventComments')
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL EventComments"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getCommentsOfEvent(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from EventComments where event_id = $1', eventID)
    .then(function(data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved comments of event" + eventID
      });
    })
    .catch(function(err) {
      return next(err);
    });
}


function createEventComment(req, res, next) {
  db
    .none(
      'insert into EventComments(event_id,user_id,date,comment_text)' +
        "values(${event_id},${user_id},${date},${comment_text})",
      req.body
    )
    .then(function() {
      res.status(200).json({
        status: "success",
        message: "Inserted one EventComment"
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeEventComment(req, res, next) {
  let eventcomment = JSON.parse(req.params.eventcomment);
  db
    .result(
      'delete from EventComments where user_id= ${user_id} AND event_id= ${event_id}',
      eventcomment
    )
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} EventComment`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

module.exports = {
  getAllEventComments: getAllEventComments,
  createEventComment: createEventComment,
  removeEventComment: removeEventComment,
  getCommentsOfEvent: getCommentsOfEvent,
};
