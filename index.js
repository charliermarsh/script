var parser = require('./script.js').parser;
var ScriptStack = require('./script-stack.js');

module.exports = {
    evaluate: function(input) {
        var stack = new ScriptStack();
        return parser.parse(input).evaluate(stack);
    },

    unlock: function(scriptSig, scriptPubKey) {
        return this.evaluate(scriptSig + ' ' + scriptPubKey);
    }
};
