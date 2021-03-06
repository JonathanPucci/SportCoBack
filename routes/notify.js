var express = require("express");
var router = express.Router();

var db = require("./queries/queriesNotify");

router.post("/user", db.notifyUser);
router.post("/team", db.notifyTeam);

module.exports = router;
