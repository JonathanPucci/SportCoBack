var express = require("express");
var router = express.Router();

var db = require("./queries/queriesUserStats");

router.get("/", db.getAllUserStats);
router.get("/:id", db.getSingleUserStats);
router.post("/", db.createUserStats);
router.put("/level/", db.updateUserLevel);
router.put("/", db.updateUserStats);
router.delete("/:userstats", db.removeUserStats);

module.exports = router;
