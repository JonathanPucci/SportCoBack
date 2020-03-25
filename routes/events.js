var express = require("express");
var router = express.Router();

var db = require("./queries/queriesEvents");

router.get("/", db.getAllEvents);
router.get("/:id", db.getSingleEvent);
router.post("/", db.createEvent);
router.put("/", db.updateEvent);
router.delete("/:event", db.removeEvent);

module.exports = router;
