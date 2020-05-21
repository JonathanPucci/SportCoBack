const AWS = require('aws-sdk');

AWS.config.update(
    process.env.S3_PRIVATE_KEY_ID == undefined ?
        require("./s3Credentials.json") :
        {
            accessKeyId: process.env.S3_PRIVATE_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_KEY
        });
let s3 = new AWS.S3();

async function getImage(folder, name) {
    const data = s3.getObject(
        {
            Bucket: 'timaka',
            Key: folder + '/' + name
        }
    ).promise();
    return data;
}



function getS3Image(folder, name, res) {
    getImage(folder, name)
        .then((img) => {
            res.send(img.Body)
        }).catch((e) => {
            res.send(e)
        })
}

module.exports = {
    getS3Image: getS3Image
}