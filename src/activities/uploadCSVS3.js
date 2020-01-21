var swf = require('../../index').awsSwf;
var config = require('../../config.json');
var fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: "",
    secretAccessKey: ""
})

const BUCKET_NAME = "streckeisen.actualit.info"
var activityPoller = new swf.ActivityPoller({
    domain: 'upload-file-S3-v2',
    taskList: { name: 'upload-file-S3-activity-task-list' },
    identity: 'upload-file-S3-poller ' + process.pid
});

activityPoller.on('activityTask', function (task) {
    console.log('Received new activity task upload-file-S3');
    var output = task.input;
    const file = fs.readFileSync('C:/nodejs-aws-swf-demo/files/users.csv')
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'users.csv',
        Body: file
    }
    s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        task.respondCompleted(output, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`File uploaded successfully. ${data.Location}`)
        });
    })


});

activityPoller.on('poll', function (d) {
    console.log('Polling for activity tasks...', d);
});

// Start polling
activityPoller.start();

process.on('SIGINT', function () {
    console.log('Got SIGINT! Stopping activity poller after this request, Please wait...');
    activityPoller.stop();
});
