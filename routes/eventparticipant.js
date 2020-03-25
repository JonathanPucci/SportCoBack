var express = require("express");
var router = express.Router();

var db = require("./queries/queriesEventParticipants");

router.get("/", db.getAllEventParticipants);
router.get("/eventParticipants/:id", db.getParticipantsOfEvent);
router.get("/participantEvents/:id", db.getEventsOfParticipant);
router.post("/", db.createEventParticipant);
router.delete("/:eventparticipant", db.removeEventParticipant);

module.exports = router;
