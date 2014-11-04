jest.autoMockOff();

var parser = require('../script.js').parser;

function exec(input) {
    return parser.parse(input);
}

describe('constants', function() {
    it('pushes 2-16 for OP_[2-16]', function() {
        for (var i = 2; i < 16; i++) {
            var script = 'OP_' + i;
            for (var j = 0; j < i; j++) {
                script += ' OP_1SUB';
            }
            script += ' OP_VERIFY';
            expect(exec(script)).toBe(false);
        }
    });
});

describe('valid', function() {
    it('returns true for a valid stack', function() {
        expect(exec('OP_1 OP_VERIFY')).toBe(true);
    });

    it('returns false for an invalid stack', function() {
        expect(exec('OP_0 OP_VERIFY')).toBe(false);
    });
});

describe('control flow', function() {
    it('adds the body if condition passes', function() {
        var script = 'OP_0 OP_1 OP_IF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('does not add body if condition fails', function() {
        var script = 'OP_0 OP_0 OP_IF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('allows multiple commands in if statement', function() {
        var script = 'OP_0 OP_1 OP_IF OP_1ADD OP_1ADD OP_ENDIF OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('allows not-if statements', function() {
        var script = 'OP_0 OP_0 OP_NOTIF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('allows else statements', function() {
        var script = 'OP_0 OP_0 OP_IF OP_NOP OP_ELSE OP_1ADD OP_ENDIF OP_VERIFY';
        expect(exec(script)).toBe(true);
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

describe('arithmetic', function() {
    it('correctly increments', function() {
        var script = 'OP_0 OP_1ADD OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly decrements', function() {
        var script = 'OP_1 OP_1SUB OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('correctly negates', function() {
        var script = 'OP_1 OP_NEGATE OP_1ADD OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('correctly computes absolute value', function() {
        var script = 'OP_0 OP_1SUB OP_ABS OP_VERIFY';
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
