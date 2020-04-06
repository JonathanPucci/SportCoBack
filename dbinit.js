var db = require("./dbconnection").db;
var sendNotifications = require("./notifications/notifications").sendNotifications;
function createUser(name, email, photourl = undefined, token = undefined) {
  let user = {
    User_Name: name,
    Email: email,
    Photo_url: photourl,
    user_push_token: token
  };
  return db
    .none(
      'insert into Users(User_ID,User_Name,Email,Photo_url,user_push_token)' +
      "values(DEFAULT,${User_Name},${Email},${Photo_url},${user_push_token})",
      user
    )
    .then(function () {
      console.log("added user");
    })
    .catch(function (err) {
      console.log("error while adding user" + err);
    });
}

function createUserStats(userid) {
  return db
    .none(
      'insert into userstats(user_id)' +
      "values($1)",
      userid
    )
    .then(function () {
      console.log("added userstat for userid " + userid);
    })
    .catch(function (err) {
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
      'insert into EventParticipants(User_ID,Event_ID)' +
      "values(${User_ID},${Event_ID})",
      ep
    )
    .then(function () {
      console.log("added eventparticipant");
    })
    .catch(function (err) {
      console.log("error while adding eventparticipant" + err);
    });
}

function createFieldSpot(field, spid) {
  let fs = {
    Field: field,
    spot_id: spid
  };
  return db
    .none(
      'insert into FieldSpots(spot_id,Field)' +
      "values(${spot_id},${Field})",
      fs
    )
    .then(function () {
      console.log("added fieldspot");
    })
    .catch(function (err) {
      console.log("error while adding fieldspot" + err);
    });
}

function createEvent(des, p, da, hid, spid, pmi, pma, s) {
  let myevent = {
    Description: des,
    Photo: p,
    Date: da,
    Host_ID: hid,
    spot_id: spid,
    Participants_min: pmi,
    Participants_max: pma,
    Sport: s
  };
  return db
    .none(
      'insert into Events(Event_ID, Description, Photo, Date, Host_ID, spot_id, Participants_min, Participants_max, Sport)' +
      "values(DEFAULT, ${ Description}, ${ Photo}, ${ Date}, ${ Host_ID}, ${ spot_id}, ${ Participants_min}, ${ Participants_max}, ${ Sport})",
      myevent
    )
    .then(function () {
      console.log("added event");
    })
    .catch(function (err) {
      console.log("error while adding event" + err);
    });
}

function createSpot(name, lla, llo) {
  let spot = {
    spot_name: name,
    spot_longitude: llo,
    spot_latitude: lla
  };

  return db
    .none(
      'insert into Spots(spot_id,spot_name,spot_longitude,spot_latitude)' +
      "values(DEFAULT,$(spot_name),${spot_longitude}, ${spot_latitude})",
      spot
    )
    .then(function () {
      console.log("added spot");
    })
    .catch(function (err) {
      console.log("error while adding spot" + err);
    });
}

db.none('ALTER SEQUENCE events_event_id_seq RESTART; ')
  .then(() => {
    db.none('ALTER SEQUENCE fieldspots_spot_id_seq RESTART; ')
      .then(() => {
        db.none('ALTER SEQUENCE spots_spot_id_seq RESTART; ')
          .then(() => {
            db.none('ALTER SEQUENCE users_user_id_seq RESTART; ')
              .then(() => {
                db.none('TRUNCATE Users, Events, Spots,EventParticipants CASCADE')
                  .then(() => {
                    createUser("Jon", "jon.p@hotmail.fr", "https://graph.facebook.com/3147119735300212/picture", 'ExponentPushToken[rE0inYEYxPzyB9CkxMxDmx]').then(() => {
                      createUser("Omar", "Omar@blabbla.com").then(() => {
                        createUser(" TestUser Doe", "testuser_rsmbxey_doe@tfbnw.net",'https://graph.facebook.com/106377624362030/picture ').then(() => {
                          createUser("Quentin", "Quentin@blabbla.com").then(() => {
                            createUserStats(1).then(() => {
                              createUserStats(2).then(() => {
                                createUserStats(3).then(() => {
                                  createSpot('Stade Fort Carré', "43.591317", "7.124781").then(() => {
                                    createSpot('SpotFutsal', "43.5965538", "7.0980908").then(() => {
                                      createSpot('Stade Foch', "43.5769976", "7.1206588").then(() => {
                                        createEvent(
                                          "Session de foot à 8 au Fort Carré",
                                          "photo",
                                          "01/01/2018",
                                          "1",
                                          "1",
                                          "0",
                                          "10",
                                          "soccer"
                                        ).then(() => {
                                          createEvent(
                                            "Ptit futsal au Fort Carré",
                                            "photo",
                                            "01/01/2020",
                                            "1",
                                            "1",
                                            "0",
                                            "10",
                                            "futsal"
                                          ).then(() => {
                                            createEvent(
                                              "Session de foot à 5 en salle",
                                              "photo",
                                              "01/01/2018",
                                              "3",
                                              "2",
                                              "0",
                                              "5",
                                              "futsal"
                                            ).then(() => {
                                              createEvent(
                                                "Session de basket sur le terrain Foch",
                                                "photo",
                                                "01/01/2018",
                                                "1",
                                                "3",
                                                "0",
                                                "8",
                                                "basket"
                                              ).then(() => {
                                                createEventParticipant("1", "1").then(() => {
                                                  createEventParticipant("3", "1").then(() => {
                                                    createFieldSpot("basket", "1").then(() => {
                                                    createFieldSpot("futsal", "2").then(() => {
                                                      createFieldSpot("basket", "3")
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
              });
          });
      })
  })
  .catch(function (err) {
    console.log("error while cleaning db" + err);
  });


sendNotifications([{
  user_push_token : 'ExponentPushToken[rE0inYEYxPzyB9CkxMxDmx]',
  user_id : 1,
  message_type : 'EVENT_CHANGED',
  data_type: 'event_id',
  data_value : 3
}])