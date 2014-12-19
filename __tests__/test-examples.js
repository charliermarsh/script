jest.autoMockOff();

var base = require('../lib/config.js').base;
var isPrime = require('../examples/primes.js');
var lockWithPassword = require('../examples/password.js');

describe('primes', function() {
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

describe('passwords', function() {
    it('unlocks when provided with the right password', function() {
        var password = '15478231';
        expect(lockWithPassword(password)(password)).toBe(true);
    });

    it('does not unlock when provided with the wrong password', function() {
        var password = '15478231';
        var guess = '15478232';
        expect(lockWithPassword(password)(guess)).toBe(false);
    });
});
