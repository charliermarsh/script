var { sha256 } = require('../src/crypto.js');
var { base } = require('../src/config.js');
var { unlock } = require('../src/index.js');

/*
 * This function only unlocks if the user supplies a three-digit prime number.
 */
function isPrime(scriptSig) {
    var minValue = 100;
    var maxValue = 999;

    var scriptPubKey = '';
    for (var i = 2; i < Math.sqrt(maxValue); i++) {
        var commands = [
            'OP_DUP',
            i,
            'OP_MOD',
            'OP_0',
            'OP_EQUAL',
            'OP_IF',
            'OP_RETURN',
            'OP_ENDIF'
        ];

        scriptPubKey += commands.join(' ') + ' ';
    }
    var conclusion = [
        '0x' + minValue.toString(base),
        '0x' + maxValue.toString(base),
        'OP_WITHIN',
        'OP_VERIFY'
    ];

    scriptPubKey += conclusion.join(' ');
    return unlock(scriptSig, scriptPubKey, /* enableDisabled */ true);
}

module.exports = isPrime;
