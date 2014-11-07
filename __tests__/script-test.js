jest.autoMockOff();

var exec = require('../index.js');
var keyGen = require('../key-gen.js');
var config = require('../config.js');

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

    it('pushes arbitrary hex data', function() {
        for (var i = 0; i < 17; i++) {
            var script = i.toString(16) + ' OP_0' ;
            for (var j = 0; j < i; j++) {
                script += ' OP_1ADD';
            }
            script += ' OP_EQUAL OP_VERIFY';
            expect(exec(script)).toBe(true);
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

    it('allows for concatenated OP_EQUALVERIFY', function() {
        expect(exec('OP_0 OP_0 OP_EQUALVERIFY')).toBe(true);
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
    it('correctly ifdups', function() {
        var script = 'OP_0 OP_1 OP_IFDUP OP_DROP OP_VERIFY';
        expect(exec(script)).toBe(true);
    })

    it('correctly computes depth', function() {
        var script = 'OP_0 OP_0 OP_DEPTH OP_1SUB OP_1SUB OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('correctly drops', function() {
        var script = 'OP_1 OP_0 OP_DROP OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly duplicates', function() {
        var script = 'OP_1 OP_DUP OP_EQUAL OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly drops second element', function() {
        var script = 'OP_0 OP_1 OP_0 OP_NIP OP_DROP OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('correctly copies over', function() {
        var script = 'OP_0 OP_1 OP_0 OP_OVER OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly picks', function() {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_0 OP_1ADD OP_1ADD OP_1ADD OP_1ADD OP_PICK OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly rolls', function() {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_0 OP_1ADD OP_1ADD OP_1ADD OP_1ADD OP_ROLL OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly rotates', function() {
        var script = 'OP_1 OP_0 OP_0 OP_ROT OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly swaps', function() {
        var script = 'OP_1 OP_0 OP_SWAP OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly duplicates three times', function() {
        var script = 'OP_1 OP_0 OP_0 OP_3DUP OP_2DROP OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly computes over twice', function() {
        var script = 'OP_0 OP_1 OP_0 OP_0 OP_2OVER OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly rotates twice', function() {
        var script = 'OP_1 OP_0 OP_1 OP_1 OP_1 OP_1 OP_2ROT OP_VERIFY';
        expect(exec(script)).toBe(false);
    });

    it('correctly swaps the top pair', function() {
        var script = 'OP_1 OP_0 OP_0 OP_0 OP_2SWAP OP_DROP OP_VERIFY';
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

    it('correctly computes boolean operators', function() {
        var script = 'OP_1 OP_1 OP_BOOLAND OP_VERIFY';
        expect(exec(script)).toBe(true);

        script = 'OP_0 OP_1 OP_BOOLAND OP_VERIFY';
        expect(exec(script)).toBe(false);

        script = 'OP_0 OP_1 OP_BOOLOR OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly computes comparison operators', function() {
        var script = 'OP_0 OP_1 OP_LESSTHAN OP_VERIFY';
        expect(exec(script)).toBe(true);

        script = 'OP_0 OP_0 OP_LESSTHANOREQUAL OP_VERIFY';
        expect(exec(script)).toBe(true);

        script = 'OP_0 OP_0 OP_GREATERTHAN OP_VERIFY';
        expect(exec(script)).toBe(false);

        script = 'OP_0 OP_0 OP_GREATERTHANOREQUAL OP_VERIFY';
        expect(exec(script)).toBe(true);
    });

    it('correctly computes the maximum', function() {
        var script = 'OP_5 OP_12 OP_MAX OP_12 OP_EQUAL OP_VERIFY';
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

    it('correctly checks signatures', function() {
        // (These were generated offline.)
        var publicKey = '022e789558bfe08662c99b3badf38449ca39338ad9191bdfc7018128da624d02c8';
        var privateKey = '4d01ffe2b0d8797aed5f187af4c310082e6b429ed662848d52aba2cd6df847c2';

        // Sign message
        var shaMsg = config.nonce;
        var signature = ecdsa.sign(shaMsg, new Buffer(privateKey, 'hex'));
        var concatenatedSig = signature.r.toString() + signature.s.toString();

        // Run script
        var script = concatenatedSig + ' ' + publicKey + ' OP_CHECKSIG OP_VERIFY';
        expect(exec(script)).toBe(true);
    });
});
