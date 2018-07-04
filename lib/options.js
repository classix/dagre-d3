var _ = require("./lodash");

// Public utility functions
module.exports = {
  setOptions: setOptions,
  getOptions: getOptions
};

var options = {
  horizontalLabels: false
};

function setOptions(o) {
  _.assign(options, o);
}

function getOptions() {
  return options;
}