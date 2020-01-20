var async = require('async');
var awsSwf = require('../index').awsSwf;
var swf = awsSwf.createClient();

async.auto({
    registerDomain: function(cb) {
        swf.registerDomain({
            name: 'upload-file-S3-v2',
            description: 'domain for S3 file upload',
            workflowExecutionRetentionPeriodInDays: '1'
        }, function (err, results) {
            if (err && err.code != 'DomainAlreadyExistsFault') {
                console.log('Unable to register domain: ', err);
                return cb(err);
            }
            console.log('Registered upload-file-S3 domain.');
            cb();
        });
    },
    registerWorkflowType: [ 'registerDomain', function(cb) {
        swf.registerWorkflowType({
            domain: 'upload-file-S3-v2',
            name: 'upload-CSV-file-to-S3',
            version: '0.2'
        }, function (err, results) {
            if (err && err.code != 'TypeAlreadyExistsFault') {
                console.log('Unable to register workflow: ', err);
                return cb(err);
            }
            console.log('Registered Upload CSV File workflow.');
            cb();
        });
    }],
    registerUploadCSVFileActivity: [ 'registerWorkflowType', function(cb) {
        swf.registerActivityType({
            domain: 'upload-file-S3-v2',
            name: 'Upload-CSV-file',
            version: '0.2',
            defaultTaskList : { name: 'upload-file-S3-activity-task-list' }
        }, function (err, results) {
            if (err && err.code != 'TypeAlreadyExistsFault') {
                console.log('Unable to register activity type: ', err);
                return cb(err);
            }
            console.log('Registered Upload-CSV-file activity.');
            cb();
        });
    }],
}, function(err) {
    if (err) {
        console.log('Encountered error while initializing: ', err);
        return;
    }
    console.log('Registration successful!');
});