var ecdsa = require('ecdsa');
var keyGen = require('./key-gen.js');
var { base, nonce } = require('./config.js');

module.exports = {
    ripemd160(data) {
        data = data.toString(base);
        return require('ripemd160')(data).toString('hex');
    },
    sha1(data) {
        data = data.toString(base);
        return require('sha1')(data);
    },
    sha256(data) {
        data = data.toString(base);
        return require('sha256')(data);
    },
    processPubKey(data) {
        data = data.toString(base);
        return keyGen.processPubKeyString(data);
    },
    processSignature(data) {
        data = data.toString(base);
        return keyGen.processSignatureString(data);
    },
    verifySignature(signature, pubKey) {
        // As this is just a toy, we don't actually hash the message
        // contents; we just sign a nonce
        return ecdsa.verify(nonce, signature, pubKey);
    }
};
