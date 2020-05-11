var db = require("../../dbconnection").db;
var sendNotifToUserWithToken = require("../../notifications/firebaseNotifications").sendNotifToUserWithToken;

// add query functions
function getAllEventParticipants(req, res, next) {
  db
    .any('select * from EventParticipants')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL EventParticipants"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getParticipantsOfEvent(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from EventParticipants where event_id = $1', eventID)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved participants of event" + eventID
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getEventsOfParticipant(req, res, next) {
  var user_id = parseInt(req.params.id);
  db
    .any('select * from EventParticipants INNER JOIN Events ON EventParticipants.event_id = Events.event_id where EventParticipants.user_id = $1', user_id)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved events of participant" + user_id
      });
    })
    .catch(function (err) {
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
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Inserted one EventParticipant"
      });
      //findHost info
      db
        .any(
          'select * from users INNER JOIN eventparticipants ON users.user_id = eventparticipants.user_id where eventparticipants.event_id=${event_id} and eventparticipants.user_id!=${user_id}',
          req.body
        ).then((participantsData) => {
          console.log(participantsData)
          db
            .one(
              'select * from users where user_id=${user_id} ',
              req.body
            ).then((participantData) => {
              for (let index = 0; index < participantsData.length; index++) {
                const participant = participantsData[index];
                console.log(participant)
                let user = { user_id: participant.user_id };
                let notif = {
                  message_type: "PARTICIPANT_JOINED",
                  data_type: "event_id",
                  data_value: req.body.event_id,
                  data_value2: participantData.photo_url,
                  sender_id: req.body.user_id.toString()
                }
                let token = participant.user_push_token;
                sendNotifToUserWithToken(notif, user, token);
              }
            });
        });
    })
    .catch(function (err) {
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
    .then(function (result) {
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} EventParticipant`
      });
      db
        .any(
          'select * from users INNER JOIN eventparticipants ON users.user_id = eventparticipants.user_id where eventparticipants.event_id=${event_id} and eventparticipants.user_id!=${user_id}',
          eventparticipant
        ).then((participantsData) => {
          db
            .one(
              'select * from users where user_id=${user_id}',
              eventparticipant
            ).then((participantData) => {
              for (let index = 0; index < participantsData.length; index++) {
                const participant = participantsData[index];
                console.log(participant)
                let user = { user_id: participant.user_id };
                let notif = {
                  message_type: "PARTICIPANT_LEFT",
                  data_type: "event_id",
                  data_value: eventparticipant.event_id,
                  data_value2: participantData.photo_url,
                  sender_id: eventparticipant.user_id.toString()
                }
                let token = participant.user_push_token;
                sendNotifToUserWithToken(notif, user, token);
              }
            });
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllEventParticipants: getAllEventParticipants,
  createEventParticipant: createEventParticipant,
  removeEventParticipant: removeEventParticipant,
  getParticipantsOfEvent: getParticipantsOfEvent,
  getEventsOfParticipant: getEventsOfParticipant
};
