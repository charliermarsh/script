var parser = require('./script.js').parser;
var ScriptStack = require('./script-stack.js');

var Interpreter = {
    evaluate: function(input) {
        var stack = new ScriptStack();
        return parser.parse(input).evaluate(stack);
    },

    unlock: function(scriptSig, scriptPubKey) {
        return Interpreter.evaluate(scriptSig + ' ' + scriptPubKey);
    }
};

module.exports = Interpreter;
