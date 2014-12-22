jest.autoMockOff();

var { base } = require('../src/config.js');
var isPrime = require('../examples/primes.js');
var betterIsPrime = require('../examples/better-primes.js');
var lockWithPassword = require('../examples/password.js');

describe('primes', () => {
    it('accepts a three-digit prime', () => {
        var n = 829;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(true);
        expect(betterIsPrime(script)).toBe(true);
    });

    it('rejects a three-digit non-prime', () => {
        var n = 830;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(false);
        expect(betterIsPrime(script)).toBe(false);
    });

    it('rejects a four-digit prime', () => {
        var n = 9973;
        var script = '0x' + n.toString(base);
        expect(isPrime(script)).toBe(false);
        expect(betterIsPrime(script)).toBe(false);
    });
});

describe('passwords', () => {
    it('unlocks when provided with the right password', () => {
        var password = '15478231';
        expect(lockWithPassword(password)(password)).toBe(true);
    });

    it('does not unlock when provided with the wrong password', () => {
        var password = '15478231';
        var guess = '15478232';
        expect(lockWithPassword(password)(guess)).toBe(false);
    });
});
