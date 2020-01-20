var swf = require('../../index').awsSwf;
var config = require('../../config.json');
var fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3 ({
    accessKeyId: "AKIA2KFJKL4OXSLOAXUM",
    secretAccessKey: "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"
})

const BUCKET_NAME = "streckeisen.actualit.info" 
var activityPoller = new swf.ActivityPoller({
    domain: 'upload-file-S3-v2',
    taskList: { name: 'upload-file-S3-activity-task-list' },
    identity: 'upload-file-S3-poller ' + process.pid
});

activityPoller.on('activityTask', function(task) {
    console.log('Received new activity task upload-file-S3');
    var output = task.input;
    const file = fs.readFileSync('C:/aws-swf-demo/files/users.csv')
    const params = {
        Bucket: BUCKET_NAME,
        Key: 'users.csv',
        Body: file
    }
    s3.upload(params,(err,data)=>{
        if(err){
            throw err;
        }
        task.respondCompleted(output,  (err)=> {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`File uploaded successfully. ${data.Location}`)
        });
    })
   
   
});

activityPoller.on('poll', function(d) {
    console.log('Polling for activity tasks...', d);
});

// Start polling
activityPoller.start();

console.log('                      _ _   _                 _    _             ');
console.log('  ___ _ __ ___   __ _(_) | | |__   ___   ___ | | _(_)_ __   __ _ ');
console.log(' / _ \\ \'_ ` _ \\ / _` | | | | \'_ \\ / _ \\ / _ \\| |/ / | \'_ \\ / _` |');
console.log('|  __/ | | | | | (_| | | | | |_) | (_) | (_) |   <| | | | | (_| |');
console.log(' \\___|_| |_| |_|\\__,_|_|_| |_.__/ \\___/ \\___/|_|\\_\\_|_| |_|\\__, |');
console.log('                                                           |___/ ');
console.log('                  __ _                      _   _             ');
console.log('  ___ ___  _ __  / _(_)_ __ _ __ ___   __ _| |_(_) ___  _ __  ');
console.log(' / __/ _ \\| \'_ \\| |_| | \'__| \'_ ` _ \\ / _` | __| |/ _ \\| \'_ \\ ');
console.log('| (_| (_) | | | |  _| | |  | | | | | | (_| | |_| | (_) | | | |');
console.log(' \\___\\___/|_| |_|_| |_|_|  |_| |_| |_|\\__,_|\\__|_|\\___/|_| |_|');

process.on('SIGINT', function () {
    console.log('Got SIGINT! Stopping activity poller after this request, Please wait...');
    activityPoller.stop();
});
