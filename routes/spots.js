var express = require("express");
var router = express.Router();

var db = require("../queriesSpots");

router.get("/", db.getAllSpots);
router.get("/:id", db.getSingleSpot);
router.post("/", db.createSpot);
router.put("/:id", db.updateSpot);
router.delete("/:id", db.removeSpot);

module.exports = router;
