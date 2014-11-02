jest.autoMockOff();

var parser = require('../script.js').parser;

function exec(input) {
    return parser.parse(input);
}

describe('valid', function() {
    it('returns true for a valid stack', function() {
        expect(exec('OP_1 OP_VERIFY')).toBe(true);
    });

    it('returns false for an invalid stack', function() {
        expect(exec('OP_0 OP_VERIFY')).toBe(false);
    });
});
