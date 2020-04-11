var express = require("express");
var router = express.Router();

var db = require("./queries/queriesEventComments");

router.get("/", db.getAllEventComments);
router.get("/eventComments/:id", db.getCommentsOfEvent);
router.post("/", db.createEventComment);
router.delete("/:eventcomment", db.removeEventComment);

module.exports = router;
