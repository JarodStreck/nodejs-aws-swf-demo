var swf = require('../index').awsSwf;

var decider = new swf.Decider({
    domain: 'upload-file-S3-v2',
    taskList: { name: 'upload-file-S3-decision-task-list'},
    identity: 'upload-file-S3-decider ' + process.pid,
    reverseOrder: false
});

decider.on('decisionTask', function (decisionTask) {
    var workflow = decisionTask.eventList;
    if(workflow.just_started()) {
        decisionTask.response.schedule({
            name: 'step1',
            activity: {
                name: 'Upload-CSV-file',
                version: '0.2'
            }
        }, { taskList: 'upload-file-S3-activity-task-list' });
        console.log('Scheduled Upload-CSV-file-to-S3 activity');
    } else if (workflow.has_activity_completed('step1')) {
        decisionTask.response.stop({
            result: 'success'
        });
        console.log('Workflow has completed');
    } else {
        decisionTask.response.wait();
    }

    decisionTask.response.respondCompleted(decisionTask.response.decisions, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
    });

});

decider.on('poll', function(d) {
    console.log('Polling for decision tasks...', d);
});

// Start polling
decider.start();

console.log('Decider has started and is polling for state change');
//Gracefully stop decider if we quit the shell
process.on('SIGINT', function () {
    console.log('Stopping decider poller after this request, Please wait...');
    decider.stop();
});