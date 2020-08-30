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
  var spotId = parseInt(req.params.id);
  db
    .one('select * from Spots where spot_id = $1', spotId)
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

function getVisibleSpots(req, res, next) {
    console.log("hey")
  let areaVisible = req.body;
console.log(areaVisible)
  let area = {
    latitude_min: (parseFloat(areaVisible.latitude) - parseFloat(areaVisible.latitudeDelta)).toString(),
    latitude_max: (parseFloat(areaVisible.latitude) + parseFloat(areaVisible.latitudeDelta)).toString(),
    longitude_min: (parseFloat(areaVisible.longitude) - parseFloat(areaVisible.longitudeDelta)).toString(),
    longitude_max: (parseFloat(areaVisible.longitude) + parseFloat(areaVisible.longitudeDelta)).toString(),
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

function getSingleSpotByCoordinates(req, res, next) {
  let areaSelected = req.body;
  let area = {
    latitude_min: (parseFloat(areaSelected.latitude) - 0.001).toString(),
    latitude_max: (parseFloat(areaSelected.latitude) + 0.001).toString(),
    longitude_min: (parseFloat(areaSelected.longitude) - 0.001).toString(),
    longitude_max: (parseFloat(areaSelected.longitude) + 0.001).toString(),
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
  let areaSelected = req.body;
  let area = {
    latitude_min: (parseFloat(areaSelected.spot_latitude) - 0.001).toString(),
    latitude_max: (parseFloat(areaSelected.spot_latitude) + 0.001).toString(),
    longitude_min: (parseFloat(areaSelected.spot_longitude) - 0.001).toString(),
    longitude_max: (parseFloat(areaSelected.spot_longitude) + 0.001).toString(),
  }
  db
    .any("select * from spots WHERE spots.spot_longitude BETWEEN ${longitude_min} AND ${longitude_max} AND spots.spot_latitude BETWEEN ${latitude_min} AND ${latitude_max};", area)
    .then(function (data) {

      if (data.length == 0) {
        isOfficial = false;
        if (req.body.is_official != undefined)
          isOfficial = req.body.is_official
        db
          .any(
            'insert into Spots(spot_id,spot_name,spot_longitude,spot_latitude, is_official)' +
            "values(DEFAULT, $(spot_name),${spot_longitude}, ${spot_latitude}," + isOfficial + ") RETURNING spot_id",
            req.body
          )
          .then(function (data) {
            res.status(200).json({
              status: "success",
              message: "Inserted one Spot",
              data: { spot_id: data[0].spot_id }
            });
            console.log("added new spot : " + data[0].spot_id);
          })
          .catch(function (err) {
            console.log(err);
            console.log(req.body != null ? req.body.spot_name : 'body null');
            return next(err);
          });


      } else {
        console.log("too close to another spot which id is : " + data[0].spot_id);
        res.status(200).json({
          status: "success",
          message: "Already known Spot",
          data: { spot_id: data[0].spot_id }
        });
      }
    })

}

function updateSpot(req, res, next) {
  db
    .none(
      'update Spots set spot_longitude=$2,spot_latitude=$3,spot_name=$4 where spot_id=$1',
      [
        req.body.spot_id,
        req.body.spot_longitude,
        req.body.spot_latitude,
        req.body.spot_name,
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
    .result('delete from Spots where spot_id= ${spot_id}', spot)
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
  getVisibleSpots: getVisibleSpots,
  createSpot: createSpot,
  updateSpot: updateSpot,
  removeSpot: removeSpot
};
