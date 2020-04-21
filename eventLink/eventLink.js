function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log(userAgent)
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

function getId(){

}

var express = require("express");
var router = express.Router();


function getAllUsers(req, res, next) {
    let event_id = req.params.id;
    res.sendFile('eventLink.html', { root : __dirname,event_id:event_id})
}

router.get("/:id", getAllUsers);


module.exports = router;