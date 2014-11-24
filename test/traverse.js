var traverse = require('../index').traverse;

var expect = require('chai').expect;

describe('traverse', function() {
  it('should call visitor for root object', function() {
    var obj = {
      type : 'Program'
    };
    var count = 0;

    traverse(obj, function() {
      count++;
    });

    expect(count).to.equal(1);
  });

  it('should call visitor for child objects', function() {
    var obj = {
      type : 'Program',
      sub : {
        type : 'Expression',
        key : 'value'
      }
    };

    var count = 0;

    traverse(obj, function() {
      count++;
    });

    expect(count).to.equal(2);
  });

  it('should pass visited object to visitor', function() {
    var obj = {
      type : 'Program'
    };

    var called = false;

    traverse(obj, function(visitedObj) {
      expect(visitedObj).to.equal(obj);
      called = true;
    });

    expect(called).to.be.true;
  });

  it('should call enter when entering nodes', function() {
    var obj = {
      type : 'Program'
    };

    var called = false;

    traverse(obj, { enter : function(visitedObj) {
      expect(visitedObj).to.equal(obj);
      called = true;
    }});

    expect(called).to.be.true;
  });

  it('should call enter before leave for nodes', function() {
    var obj = {
      type : 'Program'
    };

    var enterCalled = false;
    var leaveCalled = false;

    traverse(obj, {
      enter : function(visitedObj) {
        expect(visitedObj).to.equal(obj);
        enterCalled = true;
      },
      leave : function(visitedObj) {
        expect(visitedObj).to.equal(obj);
        expect(enterCalled).to.be.true;
        leaveCalled = true;
      }
    });

    expect(leaveCalled).to.be.true;
  });

  it('should call leave after entering child nodes', function() {
    var obj = {
      type : 'Program',
      body : {
        type : 'BlockStatement'
      }
    };

    var enterCalled = 0;
    var leaveCalled = 0;

    traverse(obj, {
      enter : function() {
        enterCalled++;
      },
      leave : function() {
        expect(enterCalled).to.equal(2);
        leaveCalled++;
      }
    });

    expect(leaveCalled).to.equal(2);
  });

  it('should pass parent node null for root node', function() {
    var obj = {
      type : 'Program'
    };

    traverse(obj, {
      enter : function(node, parent) {
        expect(parent).to.be.null;
      },
      leave : function(node, parent) {
        expect(parent).to.be.null;
      }
    });
  });

  it('should pass parent node for child nodes', function() {
    var obj = {
      type : 'Program',
      body : {
        type : 'BlockStatement'
      }
    };

    var enterCalled = false;
    var leaveCalled = false;

    traverse(obj, {
      enter : function(node, parent) {
        if (node.type == 'BlockStatement') {
          expect(parent).to.equal(obj);
          enterCalled = true;
        }
      },
      leave : function(node, parent) {
        if (node.type == 'BlockStatement') {
          expect(parent).to.equal(obj);
          leaveCalled = true;
        }
      }
    });

    expect(enterCalled).to.be.true;
    expect(leaveCalled).to.be.true;
  });

  it('should pass the visitor as this context', function() {
    var obj = {
      type : 'Program'
    };

    var visitor = {
      enter : function() {
        expect(this).to.equal(visitor);
      },
      leave : function() {
        expect(this).to.equal(visitor);
      }
    };

    traverse(obj, visitor);
  });

  it('should allow this to accumulate values', function() {
    var obj = {
      type : 'Program'
    };

    var visitor = {
      enter : function() {
        this.called = this.called || 0;
        this.called++;
      },
      leave : function() {
        this.called = this.called || 0;
        this.called++;
      }
    };

    traverse(obj, visitor);

    expect(visitor.called).to.equal(2);
  });

  it('should traverse child property arrays', function() {
    var obj = {
      type : 'Program',
      children : [
        {
          type : 'VariableDeclaration'
        },
        {
          type : 'VariableDeclaration'
        },
      ]
    };

    var visitorCalled = 0;

    var visitor = {
      enter : function() {
        visitorCalled++;
      },
      leave : function() {
        visitorCalled++;
      }
    };

    traverse(obj, visitor);

    expect(visitorCalled++).to.equal(6); // Two times per node
  });

  it('should allow empty visitor to be passed', function() {
    traverse({}, {});
  });

  it('should not visit non AST nodes', function() {
    var obj = {
      children : [{},{}]
    };

    var visitorCalled = 0;

    var visitor = {
      enter : function() {
        visitorCalled++;
      },
      leave : function() {
        visitorCalled++;
      }
    };

    traverse(obj, visitor);

    expect(visitorCalled++).to.equal(0); // No ast nodes to visit!
  });

  it('should skip child nodes if next is not called by visit', function() {
    var ast = {
      type : 'Program',
      left : {
        type : 'Function'
      }
    };

    var called = 0;
    traverse(ast, {
      visit : function(node) {
        called++;
        return node;
      }
    });

    expect(called).to.equal(1);
  });

  it('should not throw for undefined nodes', function() {
    var called = 0;

    traverse(undefined, {
      visit : function(node) {
        called++;
        return node;
      }
    });

    expect(called).to.equal(0);
  });
});