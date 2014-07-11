'use strict';
var Readable = require('stream').Readable,
    inherits = require('util').inherits;

function StreamFromValue(value, options) {
  if (!(this instanceof StreamFromValue)) {
    return new StreamFromValue(value, options);
  }

  Readable.call(this, options);

  this.__value = value;
}
inherits(StreamFromValue, Readable);

StreamFromValue.obj = function(value, options) {
  options = options || {};
  options.objectMode = true;
  return new StreamFromValue(value, options);
};

StreamFromValue.prototype._read = function() {
  this.push(this.__value);
  if (typeof this.__value !== 'undefined' && this.__value !== null) {
    // end of data
    this.push(null);
  }
};

module.exports = StreamFromValue;
