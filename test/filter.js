var filter = require('../index').filter;
var expect = require('chai').expect;

describe('filter', function() {
  it('should filter nodes if pattern matches', function() {
    var ast = {
      type : 'Program',
      key : 'value'
    };

    var nodes = filter(ast, { key : 'value' });
    expect(nodes.length).to.equal(1);
  });

  it('should return empty nodes array if pattern does not match', function() {
    var ast = {
      type : 'Program',
      key : 'value1'
    };

    var nodes = filter(ast, { key : 'value' });
    expect(nodes.length).to.equal(0);
  });

  it('should match only properties found in match pattern', function() {
    var ast = {
      type : 'Program',
      key : 'value',
      key2 : 'value1'
    };

    var nodes = filter(ast, { key : 'value' });
    expect(nodes.length).to.equal(1);
  });

  it('should match child properties found in match pattern', function() {
    var ast = {
      type : 'Program',
      key : 'value',
      child : {
        type : 'CallExpression',
        key : 'value'
      }
    };

    var nodes = filter(ast, { child : { key : 'value' }});
    expect(nodes.length).to.equal(1);
  });

  it('should match child properties against array length field', function() {
    var ast = {
      type : 'Program',
      key : 'value1',
      names : ['a', 'b', 'c']
    };

    var nodes = filter(ast, {
      names : {
        length : function(val) {
          return val > 1;
        }
      }
    });

    expect(nodes.length).to.equal(1);
  });

  it('should not match non matching array length predicates', function() {
    var ast = {
      type : 'Program',
      key : 'value1',
      names : ['a', 'b', 'c']
    };

    var nodes = filter(ast, {
      names : {
        length : function(val) {
          return val > 3;
        }
      }
    });

    expect(nodes.length).to.equal(0);
  });
});