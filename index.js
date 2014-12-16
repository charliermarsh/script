var parser = require('./lib/script').parser;
var ScriptStack = require('./lib/script-stack');

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
