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
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://sportcoapp.firebaseio.com'
});
// admin.analytics();


 sendNotifToUserWithToken = async (notif, user, token)=>{

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
        db.none('insert into UserPushNotifications(user_id,date,message_type,data_type,data_value) ' +
            'values(${user_id},${date},${message_type_app_key},${data_type},${data_value})', pushData)


    }
    catch (error) {
        console.log('Error sending message:', error);
    };
}

module.exports = {
    sendNotifToUserWithToken: sendNotifToUserWithToken
}