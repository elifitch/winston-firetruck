const Transport = require('winston-transport');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);

module.exports = class FirehoseTransport extends Transport {
  constructor(opts) {
    super(opts);
    const defaultFormat = msg => msg
    this.firehose = new AWS.Firehose(opts.firehoseParams || {});
    this.format = opts.format || defaultFormat;
  }

  send(msg) {
    return this.firehose.putRecord({
      DeliveryStreamName: this.firehoseParams.deliveryStreamName,
      Record: {
        Data: msg
      }
    }).promise();
  }

  log(message, callback) {
    const { format, send } = this;
    const cb = typeof callback === 'function' ? callback : () => {};
    return send(format(message)).then(
      () => cb(null, true),
      error => {
        cb(error, false);
        throw new Error(error);
      }
    )
  }
};