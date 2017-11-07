const Transport = require('winston-transport');
const AWS = require('aws-sdk');

module.exports = class FirehoseTransport extends Transport {
  constructor(opts) {
    super(opts);
    if (!opts.firehoseParams.DeliveryStreamName) {
      throw new Error ('Must define firehoseParams.DeliveryStreamName')
    }
    const defaultFormat = msg => msg;
    this.firehose = new AWS.Firehose(opts.firehoseParams || {});
    this.formatMessage = opts.formatMessage || defaultFormat;
    this.firehoseParams = opts.firehoseParams;
    
    this.send = this.send.bind(this);
  }

  send(msg) {
    return this.firehose.putRecord({
      ...this.firehoseParams,
      Record: {
        Data: msg
      }
    }).promise();
  }

  log(message, callback) {
    const { formatMessage, send } = this;
    const cb = typeof callback === 'function' ? callback : () => {};
    return send(formatMessage(message))
      .then(cb(null, true))
      .catch(error => {
        cb(error, false);
        throw new Error(error);
      })
  }
};