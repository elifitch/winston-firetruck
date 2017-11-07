# winston-🚒
Tiny, super simple Kinesis Firehose transport for Winston.js 3

## Installation
Via NPM

`npm install --save winston-firetruck`

Via Yarn

`yarn add winston-firetruck`

## Usage
The only required parameter is `firehoseParams.DeliveryStreamName` which should map to the name of your kinesis firehose. `firehoseParams` can also inlude any parameter you want to pass to the AWS Firehose constructor like `credentials`, `sessionToken`, or anything else enumerated in the [AWS Firehose docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html).

Additionally, the transport accepts a message formatter function to transform the log before it gets sent.

That's it!

### Example
```js
const messageFormatter = log => {
  const { timestamp, label, level, message } = log;
  return JSON.stringify({
    created: timestamp,
    level,
    label,
    message
  });
}
const myLogger = createLogger({
  transports: [new WinstonFiretruck({
    formatMessage: messageFormatter,
    firehoseParams: {
      DeliveryStreamName: 'my-log-stream-name',
      ...AdditionalAWSKinesisFirehoseParams
    }
  })]
});
```