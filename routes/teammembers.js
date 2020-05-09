var express = require("express");
var router = express.Router();

var db = require("./queries/queriesTeamMembers");

router.get("/", db.getAllTeamMembers);
router.get("/:id", db.getSingleTeamMember);
router.post("/", db.createTeamMember);
router.delete("/:teammember", db.removeTeamMember);

module.exports = router;
