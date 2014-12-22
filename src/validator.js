var DISABLED_OPCODES = [
    /* Bitwise logic */
    'OP_INVERT',
    'OP_AND',
    'OP_OR',
    'OP_XOR',
    /* Arithmetic */
    'OP_2MUL',
    'OP_2DIV',
    'OP_MUL',
    'OP_DIV',
    'OP_MOD',
    'OP_LSHIFT',
    'OP_RSHIFT'
];

var Validator = {
    includesDisabledOpcode(input) {
        return Validator.getDisabledOpcode(input) != null;
    },

    getDisabledOpcode(input) {
        var minIdx = null;
        var minIdxOpcode = null;
        DISABLED_OPCODES.forEach((opcode) => {
            var idx = input.indexOf(opcode);
            if (idx !== -1) {
                if (minIdx == null || idx < minIdx) {
                    minIdx = idx;
                    minIdxOpcode = opcode;
                }
            }
        });
        return minIdxOpcode;
    },

    DisabledOpcodeException(input) {
        var disabledOpcode = Validator.getDisabledOpcode(input);
        this.toString = () => {
            return 'Included a disabled command: ' + disabledOpcode;
        };
    }
};

module.exports = Validator;
