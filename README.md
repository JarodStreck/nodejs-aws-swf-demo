# aws-swf-demo
Amazon Simple Workflow Service Demo Application in Node.js

### Requirements
 * [node.js](http://nodejs.org/) >= 0.8
 * An active [AWS account](http://aws.amazon.com/) with [Access Keys](http://docs.amazonwebservices.com/AWSSecurityCredentials/1.0/AboutAWSCredentials.html#AccessKeys)

### Installation

(1) Install dependencies
```
npm install
```
(2) Copy the sample configuration and replace with your own access keys
```
cp config.js.sample config.js
nano config.js
```
(3) Register the domain, workflow type and activity types
```
npm run bootstrap
```
(4) Run the decider
```
npm run decider
```
(5) Run the activity
```
npm run uploadCSVS3
```

```
(7) Start workflow execution
```
npm run starter
```
