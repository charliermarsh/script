jest.autoMockOff();

var { evaluate } = require('../src/index.js');

describe('constants', () => {
    it('pushes 2-16 for OP_[2-16]', function() {
        for (var i = 2; i < 16; i++) {
            var script = 'OP_' + i;
            for (var j = 0; j < i; j++) {
                script += ' OP_1SUB';
            }
            script += ' OP_VERIFY';
            expect(evaluate(script)).toBe(false);
        }
    });

    it('pushes arbitrary hex data', () => {
        for (var i = 0; i < 17; i++) {
            var script = i.toString(16) + ' OP_0' ;
            for (var j = 0; j < i; j++) {
                script += ' OP_1ADD';
            }
            script += ' OP_EQUAL OP_VERIFY';
            expect(evaluate(script)).toBe(true);
        }
    });

    it('pushes arbitrary hex data with a 0x prefix', () => {
        for (var i = 0; i < 17; i++) {
            var script = '0x' + i.toString(16) + ' OP_0' ;
            for (var j = 0; j < i; j++) {
                script += ' OP_1ADD';
            }
            script += ' OP_EQUAL OP_VERIFY';
            expect(evaluate(script)).toBe(true);
        }
    });
});

describe('valid', () => {
    it('returns true for a valid stack', () => {
        expect(evaluate('OP_1 OP_VERIFY')).toBe(true);
    });

    it('returns false for an invalid stack', () => {
        expect(evaluate('OP_0 OP_VERIFY')).toBe(false);
    });

    it('allows for concatenated OP_EQUALVERIFY', () => {
        expect(evaluate('OP_0 OP_0 OP_EQUALVERIFY')).toBe(true);
    });
});

describe('errors', () => {
    it('throws when you pop off an empty stack', () => {
        try {
            evaluate('OP_DROP OP_1 OP_VERIFY')
            expect(true).toBe(false);
        } catch(e) {}
    });
});

describe('control flow', () => {
    it('adds the body if condition passes', () => {
        var script = 'OP_0 OP_1 OP_IF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('does not add body if condition fails', () => {
        var script = 'OP_0 OP_0 OP_IF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('allows multiple commands in if statement', () => {
        var script = 'OP_0 OP_1 OP_IF OP_1ADD OP_1ADD OP_ENDIF OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('allows not-if statements', () => {
        var script = 'OP_0 OP_0 OP_NOTIF OP_1ADD OP_ENDIF OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('allows else statements', () => {
        var script = 'OP_0 OP_0 OP_IF OP_NOP OP_ELSE OP_1ADD OP_ENDIF OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('allows returns inside if statements', () => {
        var script = 'OP_1 OP_IF OP_4 OP_3 OP_VERIFY OP_ENDIF OP_0 OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });
});

describe('stack', () => {
    it('correctly ifdups', () => {
        var script = 'OP_0 OP_1 OP_IFDUP OP_DROP OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    })

    it('correctly computes depth', () => {
        var script = 'OP_0 OP_0 OP_DEPTH OP_1SUB OP_1SUB OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('correctly drops', () => {
        var script = 'OP_1 OP_0 OP_DROP OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly duplicates', () => {
        var script = 'OP_1 OP_DUP OP_EQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly drops second element', () => {
        var script = 'OP_0 OP_1 OP_0 OP_NIP OP_DROP OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('correctly copies over', () => {
        var script = 'OP_0 OP_1 OP_0 OP_OVER OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly picks', () => {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_0 OP_1ADD OP_1ADD OP_1ADD OP_1ADD OP_PICK OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly rolls', () => {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_0 OP_1ADD OP_1ADD OP_1ADD OP_1ADD OP_ROLL OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly rotates', () => {
        var script = 'OP_1 OP_0 OP_0 OP_ROT OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly swaps', () => {
        var script = 'OP_1 OP_0 OP_SWAP OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly duplicates three times', () => {
        var script = 'OP_1 OP_0 OP_0 OP_3DUP OP_2DROP OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly computes over twice', () => {
        var script = 'OP_0 OP_1 OP_0 OP_0 OP_2OVER OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly rotates twice', () => {
        var script = 'OP_1 OP_0 OP_1 OP_1 OP_1 OP_1 OP_2ROT OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('correctly swaps the top pair', () => {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_2SWAP OP_DROP OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });
});

describe('arithmetic', () => {
    it('correctly increments', () => {
        var script = 'OP_0 OP_1ADD OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly decrements', () => {
        var script = 'OP_1 OP_1SUB OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('correctly negates', () => {
        var script = 'OP_1 OP_NEGATE OP_1ADD OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('correctly computes absolute value', () => {
        var script = 'OP_0 OP_1SUB OP_ABS OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly computes boolean operators', () => {
        var script = 'OP_1 OP_1 OP_BOOLAND OP_VERIFY';
        expect(evaluate(script)).toBe(true);

        script = 'OP_0 OP_1 OP_BOOLAND OP_VERIFY';
        expect(evaluate(script)).toBe(false);

        script = 'OP_0 OP_1 OP_BOOLOR OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly computes comparison operators', () => {
        var script = 'OP_0 OP_1 OP_LESSTHAN OP_VERIFY';
        expect(evaluate(script)).toBe(true);

        script = 'OP_0 OP_0 OP_LESSTHANOREQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(true);

        script = 'OP_0 OP_0 OP_GREATERTHAN OP_VERIFY';
        expect(evaluate(script)).toBe(false);

        script = 'OP_0 OP_0 OP_GREATERTHANOREQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly computes the maximum', () => {
        var script = 'OP_5 OP_12 OP_MAX OP_12 OP_EQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });
});

describe('format', () => {
    it('allows extra nonterminal statements', () => {
        var script = 'OP_1 OP_VERIFY OP_2';
        expect(evaluate(script)).toBe(true);
    });

    it('adds an OP_VERIFY and succeeds', () => {
        var script = 'OP_1';
        expect(evaluate(script)).toBe(true);
    });

    it('adds an OP_VERIFY and fails', () => {
        var script = 'OP_1 OP_1SUB';
        expect(evaluate(script)).toBe(false);
    });
});
