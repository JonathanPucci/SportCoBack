var express = require("express");
var router = express.Router();

var db = require("./queries/queriesTeams");

router.get("/", db.getAllTeams);
router.get("/:id", db.getSingleTeam);
router.post("/", db.createTeam);
router.put("/", db.updateTeam);
router.delete("/:team", db.removeTeam);

module.exports = router;
