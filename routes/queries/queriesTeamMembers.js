var db = require("../../dbconnection").db;

// add query functions
function getAllTeamMembers(req, res, next) {
  db
    .any('select * from TeamMembers')
    .then(function (data) {
      res.status(200).json({
        status: "success",
        data: data,
        message: "Retrieved ALL TeamMembers"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleTeamMember(req, res, next) {
  var userid = parseInt(req.params.id);
  db
    .one('select * from TeamMembers INNER JOIN Users ON TeamMembers.member_id == Users.team_id where TeamMembers.team_id = $1', userid)
    .then(function (data) {
      console.log("===DataFriends=====");
      console.log(data);
      res.status(200).json({
        status: "success",
        data: {
          data
        },
        message: "Retrieved ONE TeamMember"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createTeamMember(req, res, next) {
  return db
    .none('insert into TeamMembers(team_id,member_id) values(${team_id},${member_id})', req.body)
    .then(function () {
      res.status(200).json({
        status: "success",
        message: "Inserted one TeamMember"
      });
    })
    .catch(function (err) {
      return next(err);
    });
}


function removeTeamMember(req, res, next) {
  var teammember = JSON.parse(req.params.teammember);
  
  let DBrequest = 'delete from teammembers where team_id= '+teammember.team_id+' and member_id='+teammember.member_id;
  db
    .result(DBrequest)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: "success",
        message: `Removed ${result.rowCount} TeamMember`
      });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllTeamMembers: getAllTeamMembers,
  getSingleTeamMember: getSingleTeamMember,
  createTeamMember: createTeamMember,
  removeTeamMember: removeTeamMember
};
