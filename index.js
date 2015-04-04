var timers, times;

timers = {};
times = {};

module.exports = {
  reset: function (key) {
    times[key] = [0, 0];
    timers[key] = null;
  },
  start: function (key) {
    if (!times[key]) {
      this.reset(key);
    }
    timers[key] = process.hrtime();
  },
  stop: function (key) {
    var diff;
    if (timers[key]) {
      diff = process.hrtime(timers[key]);
      times[key][0] += diff[0];
      times[key][1] += diff[1];
      timers[key] = null;
    }
  },
  log: function (key) {
    var total;
    total = times[key][0] * 1e9 + times[key][1];
    return console.log(key + ": " + (Math.floor(total / 1e9)) + "s " + (Math.floor(total / 1e6 % 1e3)) + "ms " + (Math.floor(total / 1e3 % 1e3)) + "μs " + (total % 1e3) + "ns");
  }
};
