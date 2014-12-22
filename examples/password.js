var { sha256 } = require('../src/crypto.js');
var { base } = require('../src/config.js');
var { unlock } = require('../src/index.js');

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
    return (guess) => {
        return unlock(guess, lockingScriptWithPassword(password));
    };
}

module.exports = lockWithPassword;
