jest.autoMockOff();

var { evaluate } = require('../src/index.js');
var { DisabledOpcodeException } = require('../src/validator.js');

describe('bitwise logic', () => {
    it('allows AND', () => {
        var script = 'OP_5 OP_4 OP_AND OP_4 OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('allows OR', () => {
        var script = 'OP_9 OP_10 OP_OR OP_11 OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('allows XOR', () => {
        var script = 'OP_5 OP_2 OP_XOR OP_7 OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('allows INVERT', () => {
        var script = 'OP_5 OP_INVERT OP_2 OP_NEGATE OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('allows compositions of boolean', () => {
        var script = 'OP_5 OP_2 OP_XOR OP_2 OP_AND OP_2 OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('does not always return true', () => {
        var script = 'OP_11 OP_7 OP_XOR OP_4 OP_EQUAL';
        expect(evaluate(script, true)).toBe(false);
    })
});

describe('arithmetic', () => {
    it('allows complex arithmetic operations', () => {
        var script = 'OP_1 OP_2MUL OP_6 OP_MUL OP_3 OP_DIV OP_4 OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });

    it('allows bit-shift operations', () => {
        var script = 'OP_12 OP_DUP OP_2 OP_LSHIFT OP_2 OP_RSHIFT OP_EQUAL';
        expect(evaluate(script, true)).toBe(true);
    });
});

describe('errors', () => {
    it('throws when you pass in a disabled command', () => {
        var script = 'OP_1 OP_2MUL OP_VERIFY';
        expect(() => evaluate(script)).toThrow();
    });
});
