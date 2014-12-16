var base = require('../config.js').base;
var unlock = require('../index.js').unlock;


function getPrimes(maxValue) {
    // To start, assume (2, maxValue - 1) are prime
    var isPrime = [];
    for (var i = 0; i < maxValue; i++) {
        isPrime.push(true);
    }

    // Remove prime multiples
    var maxFactor = Math.sqrt(maxValue);
    for (i = 2; i <= maxFactor; i++) {
        if (isPrime[i]) {
            for (var j = i * i; j < maxValue; j += i) {
                isPrime[j] = false;
            }
        }
    }

    // Output if isPrime[i]
    var primes = [];
    for (i = 2; i < maxValue; i++) {
        if (isPrime[i]) {
            primes.push(i);
        }
    }
    return primes;
};

/*
 * This function only unlocks if the user supplies a four-digit prime number.
 */
function isPrime(scriptSig) {
    var minValue = 1000;
    var maxValue = 9999;
    var primes = getPrimes(maxValue);

    var scriptPubKey = '';
    for (var i = 0; i < primes.length; i++) {
        var commands = [
            'OP_DUP',
            '0x' + primes[i].toString(base),
            'OP_EQUAL',
        ];
        // If this is not the comparsion, OR with flag
        if (scriptPubKey) {
            commands.push('OP_ROT');
            commands.push('OP_BOOLOR');
        }
        commands.push('OP_SWAP');

        scriptPubKey += commands.join(' ') + ' ';
    }
    var conclusion = [
        '0x' + minValue.toString(base),
        '0x' + maxValue.toString(base),
        'OP_WITHIN',
        'OP_BOOLAND',
        'OP_VERIFY'
    ];

    scriptPubKey += conclusion.join(' ');
    return unlock(scriptSig, scriptPubKey);
}
