var swf = require('../index').awsSwf;

var workflow = new swf.Workflow({
    domain: 'upload-file-S3-v2',
    workflowType: {
        name: 'upload-CSV-file-to-S3',
        version: '0.2'
    },
    executionStartToCloseTimeout: '1800',
    taskStartToCloseTimeout: '1800',
    taskList: { name: 'upload-file-S3-decision-task-list' },
    childPolicy: 'TERMINATE'
});

workflow.start({ input: 'data' }, function (err, runId) {
    if (err) {
        console.log('Cannot start workflow: ', err);
        return;
    }
    console.log('Workflow started: ' + runId);
});