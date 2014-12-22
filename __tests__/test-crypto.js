jest.autoMockOff();

var _ = require('underscore');
var { evaluate } = require('../src/index.js');
var { base } = require('../src/config.js');
var keyGen = require('../src/key-gen.js');

// Generated offline with key-gen to avoid weird Jest import bug with CoinKey
var signatures = [
    {
        signatureString: '8459928119273117345498277881459870695761758288324491597610541854186847739718715161792675821745501378459187582098956166340492444286324429807893570567079694',
        pubKeyString: '0348726694288015a15558ed9bebcf398684cb95988bb9fa1c59366415871e9ecc'
    },
    {
        signatureString: '359013117593625562847834485308942675006275634358157870564696826123508019658034368102600701985522861717064001340630546221479973780472990911018652332699118',
        pubKeyString: '036c3bc159a79b09929b173ffe89d8f00f4b28bd2a04731057ac28016a9dbd8942'
    },
    {
        signatureString: '5763427143408138114322985252305477332958871887579660753420169681728273027623211113945692335295828231065825780515677824656262714455554844949463958620552598',
        pubKeyString: '033c25785c9776627de15063f95a157d9c6d5be728f437dab86b14cec7c07c3b80'
    }
];

describe('hashing', () => {
    it('generates different hashes for different values', () => {
        var script = 'OP_1 OP_HASH256 OP_0 OP_HASH256 OP_EQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(false);
    });

    it('generates the same hash for the same value', () => {
        var script = 'OP_1 OP_HASH256 OP_1 OP_HASH256 OP_EQUAL OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });
});

describe('signing', () => {
    /*
     * Generates a simple OP_CHECKMULTISIG script using the first `numSigs` and
     * `numPubKeys` signatures and public keys, wrapping around if `numSigs`
     * or `numPubKeys` is greater than `signatures.length`.
     */
    var generateMultiSigScript = (numSigs, numPubKeys) => {
        // You can pass in an array of indices, or just a number
        var sigIndices;
        if (typeof numSigs === 'number') {
            sigIndices = _.range(numSigs);
        } else {
            sigIndices = numSigs;
        }
        var pubKeyIndices;
        if (typeof numPubKeys === 'number') {
            pubKeyIndices = _.range(numPubKeys);
        } else {
            pubKeyIndices = numPubKeys;
        }

        // Generate script
        var script = '';

        // Add signatures
        for (var i = 0; i < sigIndices.length; i++) {
            if (script) {
                script += ' ';
            }
            var idx = sigIndices[i];
            script += signatures[idx % signatures.length].signatureString;
        }
        script += ' ' + sigIndices.length.toString(base);

        // Add public keys
        for (var i = 0; i < pubKeyIndices.length; i++) {
            if (script) {
                script += ' ';
            }
            var idx = pubKeyIndices[i];
            script += signatures[idx % signatures.length].pubKeyString;
        }
        script += ' ' + pubKeyIndices.length.toString(base);
        script += ' OP_CHECKMULTISIG OP_VERIFY';
        return script;
    }

    it('correctly checks individual signatures', () => {
        var signature = signatures[0];
        var signatureString = signature.signatureString;
        var pubKeyString = signature.pubKeyString;

        // Run script
        var script = signatureString + ' ' + pubKeyString +
            ' OP_CHECKSIG OP_VERIFY';
        expect(evaluate(script)).toBe(true);
    });

    it('correctly checks multiple signatures', () => {
        var script = generateMultiSigScript(signatures.length,
            signatures.length);
        expect(evaluate(script)).toBe(true);
    });

    it('fails if there are too few keys', () => {
        var numSigs = 2;
        var numPubKeys = 1;
        var script = generateMultiSigScript(numSigs, numPubKeys);
        expect(evaluate(script)).toBe(false);
    });

    it('accepts too many keys', () => {
        var numSigs = signatures.length;
        var numPubKeys = 2 * numSigs + 1;
        var script = generateMultiSigScript(numSigs, numPubKeys);
        expect(evaluate(script)).toBe(true);
    });

    it('fails if keys are in the wrong order', () => {
        var numSigs = signatures.length;
        // Shuffle keys
        var indices = _.range(numSigs);
        var pubKeyIndices = _.shuffle(indices);
        while (_.isEqual(pubKeyIndices, indices)) {
            pubKeyIndices = _.shuffle(indices);
        }

        var script = generateMultiSigScript(numSigs, pubKeyIndices);
        expect(evaluate(script)).toBe(false);
    });
});
