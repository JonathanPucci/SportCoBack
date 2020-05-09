var db = require("../../dbconnection").db;

// add query functions
function getAllTeams(req, res, next) {
  db
    .any('select * from Teams')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL Teams"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getSingleTeam(req, res, next) {
  var teamID = parseInt(req.params.id);
  db
    .one('select * from Teams where team_id = $1', teamID)
    .then(function (teamData) {
      db
        .any('select * from TeamMembers INNER JOIN Users ON Teammembers.member_id = Users.user_id where team_id = $1', teamID)
        .then(function (membersData) {
          res.status(200).json({
            status: "success",
            data: {
              team: teamData,
              teammembers: membersData
            },
            message: "Retrieved ONE Team"
          });
        })
    })

    .catch(function (err) {
      return next(err);
    });
}

function createTeam(req, res, next) {
  console.log(req.body.team_creation_date)
  db
    .any(
      'insert into Teams( team_id,team_name, team_description, team_manager, team_creation_date)' +
      "values( DEFAULT, ${team_name}, ${team_description}, ${team_manager}, ${team_creation_date}) RETURNING team_id",
      req.body
    )
    .then(function (data) {
      res.status(200).json({
        status: "success",
        message: "Inserted one Team",
        team_id: data[0].team_id,
      });
    })
    .catch(function (err) {
      console.log("==============ERROOOOOORRR=========");
      console.log(err);
      console.log("==============ERROOOOOORRR=========");
      return next(err);
    });
}

function updateTeam(req, res, next) {
  db
    .none(
      'update Teams set team_name=${team_name}, team_description=${team_description}, team_manager=${team_manager} where team_id=${team_id} ',
      req.body
    )
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Updated Team"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeTeam(req, res, next) {
  var team = JSON.parse(req.params.team);
  db.any('select * from users INNER JOIN teammembers on teammembers.user_id = Users.user_id where teammembers.team_id = ${team_id}', team)
    .then((data) => {
      console.log('Members to alert : ');
      console.log(data);
      db
        .result('delete from Teams where team_id = ${team_id}', team)
        .then(function (result) {
          /* jshint ignore:start */
          res.status(200).json({
            status: "success",
            message: `Removed ${result.rowCount} Team`
          });
        })
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllTeams: getAllTeams,
  getSingleTeam: getSingleTeam,
  createTeam: createTeam,
  updateTeam: updateTeam,
  removeTeam: removeTeam
};
