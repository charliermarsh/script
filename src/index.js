var { parser } = require('./script.js');
var Validator = require('./validator.js');

var Interpreter = {
    parse(input, allowDisabled) {
        if (!allowDisabled && Validator.includesDisabledOpcode(input)) {
            throw new Validator.DisabledOpcodeException(input);
        }

        return parser.parse(input);
    },

    evaluate(input, allowDisabled) {
        return Interpreter.parse(input, allowDisabled).value;
    },

    unlock(scriptSig, scriptPubKey, allowDisabled) {
        return Interpreter.evaluate(scriptSig + ' ' + scriptPubKey, allowDisabled);
    }
};

module.exports = Interpreter;
