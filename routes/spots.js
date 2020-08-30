var express = require("express");
var router = express.Router();

var db = require("./queries/queriesSpots");

router.get("/", db.getAllSpots);
router.get("/:id", db.getSingleSpot);
router.post("/coordinates", db.getSingleSpotByCoordinates);
router.post("/visible", db.getVisibleSpots);
router.post("/", db.createSpot);
router.put("/", db.updateSpot);
router.delete("/:spot", db.removeSpot);

module.exports = router;
