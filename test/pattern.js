var pattern = require('../index').pattern;
var expect = require('chai').expect;

describe('pattern', function() {
  it('should match pattern if visited pattern matches', function() {
    var obj = {
      key : 'value'
    };

    var matches = pattern({ key : 'value' });
    expect(matches(obj)).to.equal(true);
  });

  it('should not match non matching pattern', function() {
    var obj = {
      key : 'value1'
    };

    var matches = pattern({ key : 'value' });
    expect(matches(obj)).to.equal(false);
  });

  it('should match only properties found in match pattern', function() {
    var obj = {
      key : 'value',
      key2 : 'value1'
    };

    var matches = pattern({ key : 'value' });
    expect(matches(obj)).to.equal(true);
  });

  it('should match child properties found in match pattern', function() {
    var obj = {
      key : 'value',
      child : {
        key : 'value'
      }
    };

    var matches = pattern({ child : { key : 'value' }});
    expect(matches(obj)).to.equal(true);
  });

  it('should not match child properties not matching in match pattern', function() {
    var obj = {
      key : 'value',
      child : {
        key : 'value1'
      }
    };

    var matches = pattern({ child : { key : 'value' }});
    expect(matches(obj)).to.equal(false);
  });

  it('should match pattern by functions', function() {
    var obj = {
      key : 'value',
      child : {
        key : 'value'
      }
    };

    var matches = pattern({ key : function(value) { return value == 'value' }});
    expect(matches(obj)).to.equal(true);
  });

  it('should not match pattern by functions if function returns false', function() {
    var obj = {
      key : 'value',
      child : {
        key : 'value'
      }
    };

    var matches = pattern({ key : function() { return false; }});
    expect(matches(obj)).to.equal(false);
  });
});