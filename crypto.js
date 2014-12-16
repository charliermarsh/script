var ecdsa = require('ecdsa');
var keyGen = require('./key-gen.js');
var config = require('./config.js');

module.exports = {
    ripemd160: function(data) {
        data = data.toString(config.base);
        return require('ripemd160')(data).toString('hex');
    },
    sha1: function(data) {
        data = data.toString(config.base);
        return require('sha1')(data);
    },
    sha256: function(data) {
        data = data.toString(config.base);
        return require('sha256')(data);
    },
    processPubKey: function(data) {
        data = data.toString(config.base);
        return keyGen.processPubKeyString(data);
    },
    processSignature: function(data) {
        data = data.toString(config.base);
        return keyGen.processSignatureString(data);
    },
    verifySignature: function(signature, pubKey) {
        // As this is just a toy, we don't actually hash the message
        // contents; we just sign a nonce
        return ecdsa.verify(config.nonce, signature, pubKey);
    }
};
