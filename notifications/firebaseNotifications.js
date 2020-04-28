var admin = require('firebase-admin');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC9px960ofSQlIrqKFmyj8_aqWnimsEFS0",
    authDomain: "sportcoapp.firebaseapp.com",
    databaseURL: "https://sportcoapp.firebaseio.com",
    projectId: "sportcoapp",
    storageBucket: "sportcoapp.appspot.com",
    messagingSenderId: "87122479659",
    appId: "1:87122479659:web:9ab68df8f297560e24f86e",
    measurementId: "G-02QM7Q1GGL"
};

var serviceAccount = require("../sportcoapp-firebase-adminsdk-jchxw-641566c3e5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sportcoapp.firebaseio.com"
});
// Initialize Firebase
// admin.initializeApp(firebaseConfig);
// admin.analytics();


sendNotifToUserWithToken = async (notif, user, token) => {

    var notification =
    {
        title: notif.message_type,
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
// let token = 'ew_GGUma6p8:APA91bGMPVgR0kG7mkr7WQwui1d28_4mdQst4syBJAdnhIyXgFeELaioku-9ufIx8fkHWaxDbWh0S7w5aOqHPNBeh1Jl_OeWNsMdJvtGfMYd_Vmh_FCQwLMBhbV_o6VEjJPfzG8E6yQw';
// sendNotifToUserWithToken(notif, user, token);

module.exports = {
    sendNotifToUserWithToken: sendNotifToUserWithToken
}