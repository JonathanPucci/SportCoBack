var express = require("express");
var router = express.Router();

var db = require("./queries/queriesFieldSpot");

router.get("/", db.getAllFieldSpots);
router.get("/:id", db.getFieldsOfSpot);
router.post("/", db.createFieldSpot);
router.delete("/:fieldspot", db.removeFieldSpot);

module.exports = router;
