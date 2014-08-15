var traverse = require('./traverse');
var pattern = require('./pattern');

module.exports = function(ast, match) {
  var matches = pattern(match);

  var nodes = [];

  traverse(ast, function(node) {
    if (matches(node)) {
      nodes.push(node);
    }
  });

  return nodes;
};