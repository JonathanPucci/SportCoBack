var express = require("express");
var router = express.Router();

var db = require("../queriesEvents");

router.get("/", db.getAllEvents);
router.get("/:id", db.getSingleEvent);
router.post("/", db.createEvent);
router.put("/:id", db.updateEvent);
router.delete("/:id", db.removeEvent);

module.exports = router;
