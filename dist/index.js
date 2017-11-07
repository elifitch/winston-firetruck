function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Transport = require('winston-transport');

var AWS = require('aws-sdk');

module.exports =
/*#__PURE__*/
function (_Transport) {
  _inherits(FirehoseTransport, _Transport);

  function FirehoseTransport(opts) {
    var _this;

    _classCallCheck(this, FirehoseTransport);

    _this = _possibleConstructorReturn(this, (FirehoseTransport.__proto__ || Object.getPrototypeOf(FirehoseTransport)).call(this, opts));
    console.log(_this);

    if (!opts.firehoseParams.DeliveryStreamName) {
      throw new Error('Must define firehoseParams.DeliveryStreamName');
    }

    var defaultFormat = function defaultFormat(msg) {
      return msg;
    };

    _this.firehose = new AWS.Firehose(opts.firehoseParams || {});
    _this.formatMessage = opts.formatMessage || defaultFormat;
    _this.firehoseParams = opts.firehoseParams;
    _this.send = _this.send.bind(_this);
    return _this;
  }

  _createClass(FirehoseTransport, [{
    key: "send",
    value: function send(msg) {
      return this.firehose.putRecord(_extends({}, this.firehoseParams, {
        Record: {
          Data: msg
        }
      })).promise();
    }
  }, {
    key: "log",
    value: function log(message, callback) {
      var formatMessage = this.formatMessage,
          send = this.send;
      var cb = typeof callback === 'function' ? callback : function () {};
      return send(formatMessage(message)).then(cb(null, true)).catch(function (error) {
        cb(error, false);
        throw new Error(error);
      });
    }
  }]);

  return FirehoseTransport;
}(Transport);