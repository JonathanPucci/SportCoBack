var express = require("express");
var router = express.Router();

var db = require("../queriesFieldSpot");

router.get("/", db.getAllFieldSpots);
router.get("/:id", db.getFieldsOfSpot);
router.post("/", db.createFieldSpot);
router.delete("/:spot_id/:field", db.removeFieldSpot);

module.exports = router;
