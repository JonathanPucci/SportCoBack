var express = require("express");
var router = express.Router();

var db = require("./queries/queriesTeamMembers");

router.get("/", db.getAllTeamMembers);
router.get("/:id", db.getSingleTeamMember);
router.post("/", db.createTeamMember);
router.delete("/:teammember", db.removeTeamMember);
router.post("/waiting", db.createTeamMemberWaiting);
router.delete("/waiting/:teammember", db.removeTeamMemberWaiting);

module.exports = router;
