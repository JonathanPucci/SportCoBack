var express = require("express");
var router = express.Router();

var db = require("./queries/queriesUsers");

router.get("/", db.getAllUsers);
router.get("/:id", db.getSingleUser);
router.post("/", db.createUser);
router.put("/", db.updateUser);
router.delete("/:user", db.removeUser);

module.exports = router;
