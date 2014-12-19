var { parser } = require('./script.js');

var Interpreter = {
    evaluate(input) {
        return parser.parse(input).value;
    },

    unlock(scriptSig, scriptPubKey) {
        return Interpreter.evaluate(scriptSig + ' ' + scriptPubKey);
    }
};

module.exports = Interpreter;
