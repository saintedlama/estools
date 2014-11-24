// Executes visitor on the object and its children (recursively).
var util = require('util');

var isAstNode = function(node, nodeName) {
  return node !== null && node.type && nodeName != 'parent';
};

var traverse = function(node, parent, visitor) {
  if (!node) {
    return;
  }

  // Only visit ast node properties
  if (!isAstNode(node)) {
    return;
  }

  visitor.enter.call(visitor, node, parent);

  visitor.visit.call(visitor, node, parent, function() {
    for (var key in node) {
      if (node.hasOwnProperty(key)) {
        var child = node[key];

        if (typeof child === 'object' && isAstNode(child, key)) {
          traverse(child, node, visitor);
        } else if (util.isArray(child)) {
          child.forEach(function(childItem) {
            if (isAstNode(childItem, key)) {
              traverse(childItem, node, visitor);
            }
          });
        }
      }
    }
  });


  // Is always an ast node, so no checks required here
  visitor.leave.call(visitor, node, parent);
};

module.exports = function(ast, visitor) {
  if (typeof(visitor) == 'function') {
    visitor = {
      enter : visitor
    }
  }

  visitor.enter = visitor.enter || function() {};
  visitor.leave = visitor.leave || function() {};
  visitor.visit = visitor.visit || function(node, parent, next) {
    next();
  };

  return traverse(ast, null, visitor);
};
