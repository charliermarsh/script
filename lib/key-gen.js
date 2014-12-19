var sha256 = require('sha256');
var ecdsa = require('ecdsa');
var sr = require('secure-random');
var bigi = require('bigi');
var config = require('./config.js');


module.exports = {
    generateSignature() {
        var CoinKey = require('coinkey');

        // Generate random public-private keys
        var ck = new CoinKey(sr.randomBuffer(32), true);
        var pubKeyString = ck.publicKey.toString('hex');

        // Sign message
        var shaMsg = config.nonce;
        var signature = ecdsa.sign(shaMsg, ck.privateKey);
        var signatureString = signature.r.toString() + signature.s.toString();

        return {
            signatureString: signatureString,
            pubKeyString: pubKeyString
        };
    },

    processPubKeyString(pubKeyString) {
        if (pubKeyString.length % 2 !== 0) {
            pubKeyString = '0' + pubKeyString;
        }
        return new Buffer(pubKeyString, 'hex');
    },

    processSignatureString(signatureString) {
        var rString = signatureString.substr(0, signatureString.length / 2);
        var sString = signatureString.substr(signatureString.length / 2);
        return {
            r: new bigi(rString),
            s: new bigi(sString)
        };
    }
};
