var express = require("express");
var router = express.Router();

var db = require("./queries/queriesUserFriends");

router.get("/", db.getAllUserFriends);
router.get("/:id", db.getSingleUserFriends);
router.post("/", db.createUserFriends);
router.delete("/:userfriend", db.removeUserFriends);

module.exports = router;
