var traverse = require('../index').traverse;

var espree = require('espree');
var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;

var contents = fs.readFileSync(path.join(__dirname, 'fixtures', 'to-parse.js'));

describe('traverse', function() {
  it('should traverse espree generated asts', function() {
    var ast = espree.parse(contents, {
      loc: true,
      tolerant: true
    });

    var count = 0;

    traverse(ast, function() {
      count++;
    });

    expect(count).to.equal(8);
  });

  it('should traverse espree generated asts without visiting range, raw tokens, comments root elements', function() {
    var ast = espree.parse(contents, {
      loc: true,
      range: true,
      raw: true,
      tokens: true,
      comment: true,
      attachComment: true,
      tolerant: true
    });

    var count = 0;

    traverse(ast, function(node) {
      count++;
    });

    expect(count).to.equal(9);
  });
});

