var traverse = require('./traverse');
var pattern = require('./pattern');

module.exports = function(ast, match, options) {
  options = options || {};
  options.projection = options.projection || function(node) { return node; };

  var matches = pattern(match);

  var nodes = [];

  traverse(ast, function(node, parent) {
    if (matches(node, parent)) {
      var projectedNode = options.projection(node, parent);

      if (projectedNode) {
        nodes.push(projectedNode);
      }
    }
  });

  return nodes;
};