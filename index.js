"use strict";

var accumulator, timers, totals, counts, minimums, maximums;

accumulator = {
  resetAll: function () {
    timers = {};
    totals = {};
    counts = {};
    minimums = {};
    maximums = {};
  },
  reset: function (key) {
    totals[key] = 0;
    timers[key] = null;
    counts[key] = 0;
    minimums[key] = Infinity;
    maximums[key] = -Infinity;
  },
  start: function (key) {
    if (!totals[key]) {
      this.reset(key);
    }
    timers[key] = process.hrtime();
  },
  stop: function (key) {
    var diff, time;
    if (timers[key]) {
      diff = process.hrtime(timers[key]);
      time = diff[0] * 1e9 + diff[1];
      totals[key] += time;
      timers[key] = null;
      if (time < minimums[key]) {
        minimums[key] = time;
      }
      if (time > maximums[key]) {
        maximums[key] = time;
      }
      counts[key]++;
    }
  },
  toSeconds: function (ns) {
    return Math.floor(ns / 1e9);
  },
  toMilliseconds: function (ns) {
    return Math.floor(ns / 1e6);
  },
  toMicroseconds: function (ns) {
    return Math.floor(ns / 1e3);
  },
  toNanoseconds: function (ns) {
    return ns;
  },
  toString: function (key) {
    var time = totals[key];
    return key + ": " + (this.toSeconds(time)) + "s " + (this.toMilliseconds(time) % 1e3) + "ms " + (this.toMicroseconds(time) % 1e3) + "μs " + (time % 1e3) + "ns";
  },
  stats: function (magnitude) {
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
    for (key in timers) {
      if (timers.hasOwnProperty(key)) {
        total += totals[key];
      }
    }
    for (key in timers) {
      if (timers.hasOwnProperty(key)) {
        stat = stats[key] = {};
        stat.time = converter(totals[key]);
        stat.count = counts[key];
        stat.average = converter(totals[key] / counts[key]);
        stat.percent = 100 * totals[key] / total;
        stat.min = converter(minimums[key]);
        stat.max = converter(maximums[key]);
      }
    }
    return stats;
  },
  log: function (key) {
    return console.log(this.toString(key));
  }
};

accumulator.resetAll();

module.exports = accumulator;
