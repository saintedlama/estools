# estools

Estools provides a set of utility functions to traverse, filter and map esprima ASTs.

    npm install estools --save

## traverse
Traverses all tree nodes of an AST and calls visitor functions passing the AST node.

## filter
Filters AST nodes and returns matching AST nodes as a flat list.

## map
Maps ASTs and nodes to a normalized tree with node having child nodes stored in a nodes field array.
