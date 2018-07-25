
/**
 * Rollbar Transport
 *
 * A rollbar transport for winston.
 */

const Transport = require('winston-transport');
const Rollbar = require('rollbar');
const { LEVEL, SPLAT } = require('triple-beam');
const cycle = require('cycle');

function errorAndBufferReplacer(value) {
  if (value instanceof Error) {
    let obj = {message: value.message, stack: value.stack}
    for (let key of Object.getOwnPropertyNames(value)) {
      if (key === 'message' || key === 'stack') continue;
      if (value[key] instanceof Error) continue;
      if (value[key] instanceof Buffer) continue;
      obj[key] = value[key];
    }
    return obj;
  }
  if (value instanceof Buffer) {
    const str = value.toString('base64');
    if (str.length > 200) return str.slice(0, 200) + '...';
    return str;
  }
  return value;
}

exports.Rollbar = class extends Transport {
  constructor(opts = {}) {
    super(opts);
    if (!opts.rollbarConfig.accessToken) {
      throw "winston-transport-rollbar requires a 'rollbarConfig.accessToken' property";
    }
  
    const rollbar = new Rollbar(opts.rollbarConfig);
  
    this.name                 = 'rollbar';
    this.level                = opts.level || 'warn';
    this.metadataAsRequest    = opts.metadataAsRequest || false;
    this.silent               = opts.silent || false;
    this.rollbar              = rollbar;
    this.handleExceptions     = opts.handleExceptions || false;
  }

  /**
   * Attempt to log to the given log level, otherwise log at the default level and include the level
   * @param {String} level 
   * @param {Array} args 
   */
  performLogging(level, ...args) {
    const logMethod = this.rollbar[level];
    if (logMethod) {
      logMethod.apply(this.rollbar, args);
    } else {
      if (!args[2]) {
        args[2] = {};
      }
      args[2].logLevel = level;
      this.rollbar.log(...args);
    }
  }

  /**
  * Core logging method exposed to Winston. Metadata is optional.
  * @method log
  * @param info {object} Winston info object
  * @param callback {function} Continuation to respond to when complete.
  */
  log(info, callback) {
    const self = this;
    if (this.silent) {
      return callback(null, true);
    }

    let level = info[LEVEL] || info.level;
    let msg = info.message;
    let meta = info[SPLAT] || [];

    meta = meta.map(v => {
      v = errorAndBufferReplacer(v);
      if (typeof v === 'object') {
        v = cycle.decycle(v);
      }
      return v;
    });

    let req = undefined;
    // if (this.metadataAsRequest) {
    //   if (req && req.socket) { req = meta; }
    // } else if (meta && meta.req) {
    //   if (typeof meta.req === 'function') {
    //     req = meta.req();
    //   } else {
    //     req = meta.req;
    //   }
    // }

    const cb = function(err) {
      if (err) {
        return callback(err);
      }

      self.emit('logged');
      callback(null, true);
    };
    
    this.performLogging(level, msg, req, meta, cb);
  }
};
