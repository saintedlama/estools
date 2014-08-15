# estools [![Build Status](https://travis-ci.org/saintedlama/estools.svg?branch=master)](https://travis-ci.org/saintedlama/estools) [![Coverage Status](https://coveralls.io/repos/saintedlama/estools/badge.png?branch=master)](https://coveralls.io/r/saintedlama/estools?branch=master)

Estools provides a set of utility functions to traverse, filter and map esprima ASTs.

    npm install estools --save

    var estools = require('estools')

# API

## traverse(ast, visitor)
Traverses all tree nodes of an AST and calls visitor functions passing the AST node.

ast is the result of esprima.parse, visitor may be a function or a visitor object.

The visitor object may define the following functions

### enter(node, parent)

Called when entering a node. The current node and parent node are passed as parameter

Example

    traverse(ast, {
      enter : function(node, parent) {
        console.log(node.type);  // Print the node type to std out
      }
    });


### leave(node, parent)

Called when leaving a node. The current node and parent node are passed as parameter

Example

    traverse(ast, {
      leave : function(node, parent) {
        console.log(node.type);  // Print the node type to std out
      }
    });

### visit(node, parent, next)

Called after `enter` and before `leave`. The current node and a parent node are passed as parameter. Additionally
a function `next` is passed. The `visit` function is responsible to call `next` to visit child nodes. To skip
child nodes just omit the call to `visit`.

Example

    traverse(ast, {
      visit : function(node, parent, next) {
        next();
      }
    });

Example skipping nodes
    traverse(ast, {
      visit : function(node, parent, next) {
        if (node.type != 'FunctionExpression') { // Skip child nodes of function expressions
          next();
        }
      }
    });

## filter(ast, filterObj)

Filters AST nodes and returns matching AST nodes as a flat list.

## map(ast, mappingFunction)

Maps ASTs and nodes to a normalized tree with node having child nodes stored in a nodes field array.
