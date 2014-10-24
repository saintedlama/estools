var util = require('util');

module.exports = function(pattern) {
  var matchPattern = function(object, pattern) {
    for (var key in pattern) {
      if (pattern.hasOwnProperty(key)) {
        if (!object[key]) {
          return false;
        }

        if (typeof pattern[key] == 'function') {
          if (!pattern[key](object[key])) {
            return false;
          }
        } else if (util.isArray(pattern[key])) {
          var matches = pattern[key].some(function(item) {
            return matchPattern(object[key], item);
          });

          if (!matches) {
            return false;
          }
        } else if (typeof pattern[key] == 'object') {
          var matches = matchPattern(object[key], pattern[key]);

          if (!matches) {
            return false;
          }
        } else {
          if (object[key] !== pattern[key]) {
            return false;
          }
        }
      }
    }

    return true;
  };

  return function(object) {
    return matchPattern(object, pattern);
  };
};
