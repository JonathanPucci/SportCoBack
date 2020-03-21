var express = require("express");
var router = express.Router();

var db = require("../queriesUsers");

router.get("/", db.getAllUsers);
router.get("/:id", db.getSingleUser);
router.post("/", db.createUser);
router.put("/:id", db.updateUser);
router.delete("/:id", db.removeUser);

module.exports = router;
