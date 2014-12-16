var parser = require('./lib/script').parser;

var Interpreter = {
    evaluate: function(input) {
        return parser.parse(input).value;
    },

    unlock: function(scriptSig, scriptPubKey) {
        return Interpreter.evaluate(scriptSig + ' ' + scriptPubKey);
    }
};

module.exports = Interpreter;
