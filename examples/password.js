var sha256 = require('../lib/crypto.js').sha256;
var base = require('../lib/config.js').base;
var unlock = require('../index.js').unlock;

/*
 * Generate a locking script unlocked with password `password`.
 */
function lockingScriptWithPassword(password) {
    var commands = [
        'OP_SHA256',
        sha256(password),
        'OP_EQUALVERIFY'
    ];
    return commands.join(' ');
}

/*
 * Return a function that is unlocked when provided with password `password`.
 */
function lockWithPassword(password) {
    return function(guess) {
        return unlock(guess, lockingScriptWithPassword(password));
    };
}

module.exports = lockWithPassword;
