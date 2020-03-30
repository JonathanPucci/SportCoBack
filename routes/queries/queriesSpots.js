var db = require("../../dbconnection").db;

// add query functions
function getAllSpots(req, res, next) {
  db
    .any('select * from Spots')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Spots"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleSpot(req, res, next) {
  var eventID = parseInt(req.params.id);
  db
    .one('select * from Spots where Spot_ID = $1', eventID)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE Spot"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleSpotByCoordinates(req, res, next) {
  let areaSelected = req.body;
  let area = {
    latitude_min: (areaSelected.latitude - 0.01).toString(),
    latitude_max: (areaSelected.latitude + 0.01).toString(),
    longitude_min: (areaSelected.longitude - 0.01).toString(),
    longitude_max: (areaSelected.longitude + 0.01).toString(),
  }
  db
    .any("select * from spots WHERE spots.spot_longitude BETWEEN ${longitude_min} AND ${longitude_max} AND spots.spot_latitude BETWEEN ${latitude_min} AND ${latitude_max};", area)
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ONE Spot"
      });
    })
    .catch(function (err) {
      console.log("======ERROR=====");

      return next(err);
    });
}

function createSpot(req, res, next) {
  console.log(req.body);
  db
    .any(
      'insert into Spots(spot_id,spot_name,spot_longitude,spot_latitude)' +
      "values(DEFAULT, $(spot_name),${spot_longitude}, ${spot_latitude}) RETURNING spot_id",
      req.body
    )
    .then(function (data) {
      console.log(data);
      res.status(200).json({
        status: "success",
        message: "Inserted one Spot",
        data : {spot_id : data[0].user_id}
      });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function updateSpot(req, res, next) {
  db
    .none(
      'update Spots set spot_longitude=$2,spot_latitude=$3 where Spot_ID=$1',
      [
        req.body.Spot_ID,
        req.body.spot_longitude,
        req.body.spot_latitude,
      ]
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated Spot"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeSpot(req, res, next) {
  var spot = JSON.parse(req.params.spot);
  db
    .result('delete from Spots where Spot_ID= ${Spot_ID}', spot)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} Spot`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllSpots: getAllSpots,
  getSingleSpot: getSingleSpot,
  getSingleSpotByCoordinates: getSingleSpotByCoordinates,
  createSpot: createSpot,
  updateSpot: updateSpot,
  removeSpot: removeSpot
};
