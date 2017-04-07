(function() {
  "use strict";

  var Accumulator, startTime, stopTime;

  Accumulator = function Accumulator () {
    this.resetAll();
  }

  startTime = function () {
    if (typeof process !== "undefined" && process.hrtime != null) {
      return process.hrtime();
    } else {
      return performance.now()*1e6;
    }
  }

  stopTime = function (start) {
    var diff;
    if (typeof process !== "undefined" && process.hrtime != null) {
      diff = process.hrtime(start);
      return diff[0] * 1e9 + diff[1];
    } else {
      return performance.now()*1e6 - start;
    }
  }

  Accumulator.prototype.resetAll = function () {
    this.timers = {};
    this.totals = {};
    this.counts = {};
    this.minimums = {};
    this.maximums = {};
  }

  Accumulator.prototype.reset = function (key) {
    this.totals[key] = 0;
    this.timers[key] = null;
    this.counts[key] = 0;
    this.minimums[key] = Infinity;
    this.maximums[key] = -Infinity;
  }

  Accumulator.prototype.start = Accumulator.prototype.unpause = function (key) {
    if (!this.timers.hasOwnProperty(key)) {
      this.reset(key);
    }
    this.timers[key] = startTime();
  }

  Accumulator.prototype.pause = function (key) {
    var time;
    if (this.timers[key]) {
      time = stopTime(this.timers[key]);
      this.totals[key] += time;
      this.timers[key] = null;
      if (time < this.minimums[key]) {
        this.minimums[key] = time;
      }
      if (time > this.maximums[key]) {
        this.maximums[key] = time;
      }
    }
  }

  Accumulator.prototype.stop = function (key) {
    this.pause(key);
    if (this.timers.hasOwnProperty(key)) {
      this.counts[key]++;
    }
  }

  Accumulator.prototype.toSeconds = function (ns) {
    return Math.floor(ns / 1e9);
  }

  Accumulator.prototype.toMilliseconds = function (ns) {
    return Math.floor(ns / 1e6);
  }

  Accumulator.prototype.toMicroseconds = function (ns) {
    return Math.floor(ns / 1e3);
  }

  Accumulator.prototype.toNanoseconds = function (ns) {
    return ns;
  }

  Accumulator.prototype.toString = function (key) {
    var time = 0, index;
    if (key) {
      time = this.totals[key];
    } else {
      for (index in this.totals) {
        time += this.totals[index];
      }
      key = 'Total Time';
    }
    return key + ": " + (this.toSeconds(time)) + "s " + (this.toMilliseconds(time) % 1e3) + "ms " + (this.toMicroseconds(time) % 1e3) + "μs " + (time % 1e3) + "ns";
  }

  Accumulator.prototype.stats = function (magnitude) {
    var stats, stat, key, total, converter;
    stats = {};
    total = 0;
    switch (magnitude) {
    case 's':
    case 'seconds':
      converter = this.toSeconds;
      break;
    case 'ms':
    case 'milli':
    case 'milliseconds':
      converter = this.toMilliseconds;
      break;
    case '`s':
    case 'micro':
    case 'microseconds':
      converter = this.toMicroseconds;
      break;
    case 'ns':
    case 'nano':
    case 'nanoseconds':
      converter = this.toNanoseconds;
      break;
    default:
      converter = this.toMilliseconds;
      break;
    }
    for (key in this.timers) {
      if (this.timers.hasOwnProperty(key)) {
        total += this.totals[key];
      }
    }
    for (key in this.timers) {
      if (this.timers.hasOwnProperty(key)) {
        stat = stats[key] = {};
        stat.time = converter(this.totals[key]);
        stat.count = this.counts[key];
        stat.average = converter(this.totals[key] / this.counts[key]);
        stat.percent = 100 * this.totals[key] / total;
        stat.min = converter(this.minimums[key]);
        stat.max = converter(this.maximums[key]);
      }
    }
    return stats;
  }

  Accumulator.prototype.log = function (key) {
    return console.log(this.toString(key));
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Accumulator;
  } else {
    window.Accumulator = Accumulator;
  }

  return Accumulator;
})();
