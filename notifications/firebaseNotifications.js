var admin = require('firebase-admin');

// Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyC9px960ofSQlIrqKFmyj8_aqWnimsEFS0",
//     authDomain: "sportcoapp.firebaseapp.com",
//     databaseURL: "https://sportcoapp.firebaseio.com",
//     projectId: "sportcoapp",
//     storageBucket: "sportcoapp.appspot.com",
//     messagingSenderId: "87122479659",
//     appId: "1:87122479659:web:9ab68df8f297560e24f86e",
//     measurementId: "G-02QM7Q1GGL"
// };

var serviceAccount = {
  "type": "service_account",
  "project_id": "sportcoapp",
  "private_key_id": process.env.FB_PRIVATE_KEY_ID,
  "private_key": process.env.FB_PRIVATE_KEY,
  "client_email": "firebase-adminsdk-jchxw@sportcoapp.iam.gserviceaccount.com",
  "client_id": "116527214378414383187",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-jchxw%40sportcoapp.iam.gserviceaccount.com"
}


// var serviceAccount = require("../sportcoapp-firebase-adminsdk-jchxw-creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sportcoapp.firebaseio.com"
});
// Initialize Firebase
// admin.initializeApp(firebaseConfig);
// admin.analytics();

computeTitle = (title) => {
  console.log(title.toLowerCase().includes("joined"));
  if (title.toLowerCase().includes("cancel"))
    return "An event you join has been canceled"

  if (title.toLowerCase().includes("update"))
    return "An event you join has been updated"

  if (title.toLowerCase().includes("joined"))
    return "Someone joined your event"

  if (title.toLowerCase().includes("left"))
    return "Someone left your event"

  return title;

}


sendNotifToUserWithToken = async (notif, user, token) => {

  let notifTitle = computeTitle(notif.message_type);

  var notification =
  {
    title: notifTitle,
    body: 'Check it out !'
  };
  console.log(notif);

  let pushData = {
    user_id: user.user_id.toString(),
    date: JSON.stringify((new Date()).toJSON()),
    data_type: notif.data_type.toString(),
    data_value: notif.data_value.toString(),
    data_value2: notif.data_value2 != undefined ? notif.data_value2.toString() : '',
    message_type_app_key: notif.message_type.toString()
  }
  var messageData = {
    data: pushData,
    notification: notification,
    token: token
  };
  // Send a message to the device corresponding to the provided
  // registration token.
  try {
    let response = await admin.messaging().send(messageData)

    // Response is a message ID string.
    console.log('Successfully sent message:', response);

    var db = require("../dbconnection").db;
    db.none('insert into UserPushNotifications(user_id,date,message_type,data_type,data_value, data_value2) ' +
      'values(${user_id},${date},${message_type_app_key},${data_type},${data_value},${data_value2})', pushData)


  }
  catch (error) {
    console.log('Error sending message:', error);
  };
}

// let user = { user_id: 1 };
// let notif = {
//     message_type: "PARTICIPANT_JOINED",
//     data_type: "event_id",
//     data_value: 1,
//     data_value2: 'https://graph.facebook.com/2934553376621421/picture'
// }
// let token = 'fgawVd3t8ZA:APA91bFRrWLVkst_1oKdy34F_48lqKke1WX-2i6xPEjSF5a4WtySHiu1HJrqYmtLa5lERlFxZCE5qJ3A__CJVqi9CwXCGtc60Wp91RNvhFB8W7jpewbOCizbbGG_N710Cw53-E3OVn96';
// sendNotifToUserWithToken(notif, user, token);

module.exports = {
  sendNotifToUserWithToken: sendNotifToUserWithToken
}