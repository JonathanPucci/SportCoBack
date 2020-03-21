var db = require("./dbconnection").db;

function createUser(id, name) {
  let user = {
    User_ID: id,
    User_Name: name
  };
  return db
    .none(
      'insert into "Users"("User_ID","User_Name")' +
        "values(${User_ID},${User_Name})",
      user
    )
    .then(function() {
      console.log("added user");
    })
    .catch(function(err) {
      console.log("error while adding user" + err);
    });
}

function createEventParticipant(eid, uid) {
  let ep = {
    User_ID: uid,
    Event_ID: eid
  };
  return db
    .none(
      'insert into "EventParticipants"("User_ID","Event_ID")' +
        "values(${User_ID},${Event_ID})",
      ep
    )
    .then(function() {
      console.log("added eventparticipant");
    })
    .catch(function(err) {
      console.log("error while adding eventparticipant" + err);
    });
}

function createFieldSpot(field, spid) {
  let fs = {
    Field: field,
    Spot_ID: spid
  };
  return db
    .none(
      'insert into "FieldSpots"("Spot_ID","Field")' +
        "values(${Spot_ID},${Field})",
      fs
    )
    .then(function() {
      console.log("added fieldspot");
    })
    .catch(function(err) {
      console.log("error while adding fieldspot" + err);
    });
}

function createEvent(id, des, p, da, hid, spid, pmi, pma, s) {
  let myevent = {
    Event_ID: id,
    Description: des,
    Photo: p,
    Date: da,
    Host_ID: hid,
    Spot_ID: spid,
    Participants_min: pmi,
    Participants_max: pma,
    Sport: s
  };
  return db
    .none(
      'insert into "Events"("Event_ID", "Description", "Photo", "Date", "Host_ID", "Spot_ID", "Participants_min", "Participants_max", "Sport")' +
        "values(${Event_ID}, ${ Description}, ${ Photo}, ${ Date}, ${ Host_ID}, ${ Spot_ID}, ${ Participants_min}, ${ Participants_max}, ${ Sport})",
      myevent
    )
    .then(function() {
      console.log("added event");
    })
    .catch(function(err) {
      console.log("error while adding event" + err);
    });
}

function createSpot(id, llo, lla) {
  let spot = {
    Spot_ID: id,
    Spot_longitude: llo,
    Spot_latitude: lla
  };

  return db
    .none(
      'insert into "Spots"("Spot_ID","Spot_longitude","Spot_latitude")' +
        "values(${Spot_ID},${Spot_longitude}, ${Spot_latitude})",
      spot
    )
    .then(function() {
      console.log("added spot");
    })
    .catch(function(err) {
      console.log("error while adding spot" + err);
    });
}

db
  .none('TRUNCATE "Users", "Events", "Spots","EventParticipants" CASCADE')
  .then(() => {
    createUser("1", "Jo").then(() => {
      createSpot("1", "0", "0").then(() => {
        createEvent(
          "1",
          "descr",
          "photo",
          "01/01/2018",
          "1",
          "1",
          "0",
          "10",
          "Basketball"
        ).then(() => {
          createEventParticipant("1", "1").then(() => {
            createFieldSpot("Basketball", "1");
          });
        });
      });
    });
  })
  .catch(function(err) {
    console.log("error while cleaning db" + err);
  });
