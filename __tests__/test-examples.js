jest.autoMockOff();

var base = require('../lib/config.js').base;
var isPrime = require('../examples/primes.js');

describe('prime test', function() {
    it('accepts a three-digit prime', function() {
        var n = 829;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(true);
    });

    it('rejects a three-digit non-prime', function() {
        var n = 830;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(false);
    });

    it('rejects a four-digit prime', function() {
        var n = 9973;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(false);
    });
});
