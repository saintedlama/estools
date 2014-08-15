var traverse = require('./traverse');

// Translate an AST to a new object model using a translator function invoked by node.
// If the translator function does not return a value the current node is not translated
// to the target AST
module.exports = function(ast, map) {

  var visitor = {
    push : function(node) {
      // Build a root note to return
      if (!this.root) {
        this.root = { nodes: [] };
        this.nodes = [];

        this.nodes.push(this.root);
      }

      var head = this.nodes[this.nodes.length - 1];
      head.nodes = head.nodes || [];
      head.nodes.push(node);

      // Make it the new head!
      this.nodes.push(node);
    },

    pop : function() {
      return this.nodes.pop();
    },

    visit : function(node, parent, next) {
      var mapped = map(node);

      if (mapped) {
        this.push(mapped);
      }

      next();

      if (mapped) {
        this.pop();
      }
    }
  };

  traverse(ast, visitor);

  return visitor.root;
};