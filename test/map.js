var map = require('../index').map;
var expect = require('chai').expect;

describe('map', function() {
  it('should not map ignored nodes', function() {
    var ast = {
      type : 'Program',
      key : 'value1'
    };

    var mapping = function() {
      // don't map node by returning a falsy value
    };

    var tree = map(ast, mapping);
    expect(tree).to.not.exist;
  });

  it('should map nodes if not ignored', function() {
    var ast = {
      type : 'Program',
      key : 'value1'
    };

    var mapping = function(node) {
      return node;
    };

    var tree = map(ast, mapping);

    expect(tree).to.exist;
    expect(tree.nodes.length).to.equal(1);
    expect(tree.nodes[0].type).to.equal('Program');
    expect(tree.nodes[0].key).to.equal('value1');
  });

  it('should map nodes in the middle of the tree structure', function() {
    var ast = {
      type: 'Program',
      body : [
        { type: 'FunctionDeclaration' },
        { type: 'VariableDeclaration' }
      ]
    };

    var mapping = function(node) {
      if (node.type == 'FunctionDeclaration') {
        return { type : 'FunctionDeclaration' };
      }
    };

    var tree = map(ast, mapping);

    expect(tree).to.exist;
    expect(tree.nodes.length).to.equal(1);
    expect(tree.nodes[0].type).to.equal('FunctionDeclaration');
  });

  it('should map nodes to a valid tree structure', function() {
    var ast = {
      type: 'Program',
      body : [
        { type: 'FunctionDeclaration' },
        { type: 'VariableDeclaration' }
      ]
    };

    var mapping = function(node) {
      if (node.type == 'FunctionDeclaration' || node.type == 'Program') {
        return { type : node.type };
      }
    };

    var tree = map(ast, mapping);

    expect(tree).to.exist;
    expect(tree.nodes.length).to.equal(1);
    expect(tree.nodes[0].type).to.equal('Program');

    expect(tree.nodes[0].nodes).to.exist;
    expect(tree.nodes[0].nodes.length).to.equal(1);
    expect(tree.nodes[0].nodes[0].type).to.equal('FunctionDeclaration');
  });
});