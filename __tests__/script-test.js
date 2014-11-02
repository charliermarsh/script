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

describe('stack', function() {
    it('correctly duplicates', function() {
        var script = 'OP_1 OP_DUP OP_EQUAL OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly drops', function() {
        var script = 'OP_1 OP_0 OP_DROP OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly swaps', function() {
        var script = 'OP_1 OP_0 OP_SWAP OP_VERIFY';
        expect(exec(script)).toBe(true);
    });
});

describe('crypto', function() {
    it('generates different hashes for different values', function() {
        var script = 'OP_1 OP_HASH256 OP_0 OP_HASH256 OP_EQUAL OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('generates the same hash for the same value', function() {
        var script = 'OP_1 OP_HASH256 OP_1 OP_HASH256 OP_EQUAL OP_VERIFY';
        expect(exec(script)).toBe(true);
    });
});

