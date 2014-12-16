var bigInt = require('big-integer');
var ecdsa = require('ecdsa');
var config = require('./config.js');
var crypto = require('./crypto.js');

function StackEmptyException() {
    this.toString = function() {
      return 'Attempted to pop from an empty stack.';
    };
}

var ScriptStack = function() {
    var serialize = function(data) {
        return data.toString(config.base);
    };
    var deserialize = function(data) {
        return bigInt(data, config.base);
    };

    // Basic array operations
    this.push = function() {
        var serialized = [].map.call(arguments, serialize);
        return Array.prototype.push.apply(this, serialized);
    };
    this.pop = function() {
        if (this.length === 0 || this.length == null) {
            throw new StackEmptyException();
        }
        return deserialize(Array.prototype.pop.apply(this));
    };
    this.peek = function() {
        var value = this.pop();
        this.push(value);
        return value;
    };

    // Constants
    this.OP_0 = function() {
        this.push(0);
    };
    this.OP_FALSE = this.OP_0;
    this.OP_1NEGATE = function() {
        this.OP_1();
        this.OP_NEGATE();
    };
    this.OP_1 = function() {
        this.push(1);
    };
    this.OP_TRUE = this.OP_1;

    // Stack operations
    this.OP_IFDUP = function() {
        var top = this.peek();
        if (top.compare(0) !== 0) {
            this.push(top);
        }
    };
    this.OP_DEPTH = function() {
        this.push(this.length);
    };
    this.OP_DROP = this.pop;
    this.OP_2DROP = function() {
        this.OP_DROP();
        this.OP_DROP();
    };
    this.OP_DUP = function(n) {
        n = n || 1;

        // Extract top `n` values
        var values = [];
        for (var i = 0; i < n; i++) {
            values.push(this.pop());
        }
        values.reverse();

        for (var i = 0; i < 2 * n; i++) {
            this.push(values[i % values.length]);
        }
    };
    this.OP_2DUP = function() {
        this.OP_DUP(2);
    };
    this.OP_3DUP = function() {
        this.OP_DUP(3);
    };
    this.OP_NIP = function() {
        var top = this.pop();
        this.pop();
        this.push(top);
    };
    this.OP_OVER = function() {
        var top = this.pop();
        var bottom = this.peek();
        this.push(top);
        this.push(bottom);
    };
    this.OP_PICK = function() {
        var n = this.pop();
        var temp = [];
        for (var i = 0; i < n - 1; i++) {
            temp.push(this.pop());
        }
        var nth = this.peek();
        for (var i = 0; i < n - 1; i++) {
            this.push(temp[i]);
        }
        this.push(nth);
    };
    this.OP_ROLL = function() {
        var n = this.pop();
        var temp = [];
        for (var i = 0; i < n - 1; i++) {
            temp.push(this.pop());
        }
        var nth = this.pop();
        for (var i = 0; i < n - 1; i++) {
            this.push(temp[i]);
        }
        this.push(nth);
    };
    this.OP_ROT = function() {
        var values = [this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 1) % values.length]);
        }
    };
    this.OP_SWAP = function() {
        var values = [this.pop(), this.pop()];
        for (var i = 0; i < values.length; i++) {
            this.push(values[i]);
        }
    };
    this.OP_TUCK = function() {
        var values = [this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length + 1; i++) {
            this.push(values[i % values.length]);
        }
    };
    this.OP_2OVER = function() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length + 2; i++) {
            this.push(values[i % values.length]);
        }
    };
    this.OP_2ROT = function() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 2) % values.length]);
        }
    };
    this.OP_2SWAP = function() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 2) % values.length]);
        }
    };

    // Bitwise logic
    this.OP_EQUAL = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.equals(b)) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };

    // Artithmetic operations
    this.OP_1ADD = function() {
        this.push(this.pop().add(1));
    };
    this.OP_1SUB = function() {
        this.push(this.pop().minus(1));
    };
    this.OP_NEGATE = function() {
        this.push(this.pop().multiply(-1));
    };
    this.OP_ABS = function() {
        this.push(this.pop().abs());
    };
    this.OP_NOT = function() {
        if (this.pop().equals(0)) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_0NOTEQUAL = function() {
        if (this.pop().equals(0)) {
            this.OP_0();
        } else {
            this.OP_1();
        }
    };
    this.OP_ADD = function() {
        var b = this.pop();
        var a = this.pop();
        this.push(a.add(b));
    };
    this.OP_SUB = function() {
        var b = this.pop();
        var a = this.pop();
        this.push(a.minus(b));
    };
    this.OP_BOOLAND = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(0) !== 0 && b.compare(0) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_BOOLOR = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(0) !== 0 || b.compare(0) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_NUMEQUAL = this.OP_EQUAL;
    this.OP_NUMNOTEQUAL = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_LESSTHAN = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) < 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_GREATERTHAN = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) > 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_LESSTHANOREQUAL = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) <= 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_GREATERTHANOREQUAL = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) >= 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_MIN = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) <= 0) {
            this.push(a);
        } else {
            this.push(b);
        }
    };
    this.OP_MAX = function() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) >= 0) {
            this.push(a);
        } else {
            this.push(b);
        }
    };
    this.OP_WITHIN = function() {
        var max = this.pop();
        var min = this.pop();
        var x = this.pop();
        if (x.compare(min) >= 0 && x.compare(max) < 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };

    // Crypto
    this.OP_RIPEMD160 = function() {
        this.push(crypto.ripemd160(this.pop()));;
    };
    this.OP_SHA1 = function() {
        this.push(crypto.sha1(this.pop()));;
    };
    this.OP_SHA256 = function() {
        this.push(crypto.sha256(this.pop()));;
    };
    this.OP_HASH160 = function() {
        this.push(crypto.ripemd160(crypto.sha256(this.pop())));;
    };
    this.OP_HASH256 = function() {
        this.push(crypto.sha256(crypto.sha256(this.pop())));;
    };
    this.OP_CHECKSIG = function() {
        // Parse public key
        var pubKey = crypto.processPubKey(this.pop());

        // Parse signature
        var signature = crypto.processSignature(this.pop());

        // Verify signature
        if (crypto.verifySignature(signature, pubKey)) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    };
    this.OP_CHECKMULTISIG = function() {
        // Extract public keys
        var numPubKeys = this.pop();
        var pubKeys = [];
        var i = 0;
        while (numPubKeys.compare(i) === 1) {
            pubKeys.push(crypto.processPubKey(this.pop()));
            i++;
        }

        // Extract signatures
        var numSignatures = this.pop();
        var signatures = []
        i = 0;
        while (numSignatures.compare(i) === 1) {
            signatures.push(crypto.processSignature(this.pop()));
            i++;
        }

        // Match keys against signatures. Note that any public key that
        // fails a comparison is then removed, in accordance with the spec.
        for (i = 0; i < signatures.length; i++) {

            var matched = -1;
            for (var j = 0; j < pubKeys.length; j++) {
                if (crypto.verifySignature(signatures[i], pubKeys[j])) {
                    matched = j;
                    break;
                }
            }

            if (matched === -1) {
                this.OP_0();
                return;
            } else {
                // Remove used public keys
                pubKeys = pubKeys.splice(matched + 1);
            }

            var remainingSignatures = signatures.length - (i + 1);
            if (pubKeys.length < remainingSignatures) {
                this.OP_0();
                return;
            }
        }

        // If all checks passed, push `true`
        this.OP_1();
    };

    // Terminals
    this.OP_VERIFY = function() {
        return (this.pop().compare(0) !== 0);
    };
    this.OP_EQUALVERIFY = function() {
        this.OP_EQUAL();
        return this.OP_VERIFY();
    };
    this.OP_CHECKSIGVERIFY = function() {
        this.OP_CHECKSIG();
        return this.OP_VERIFY();
    };
    this.OP_CHECKMULTISIGVERIFY = function() {
        this.OP_CHECKMULTISIG();
        return this.OP_VERIFY();
    };
    this.OP_RETURN = function() {
        return false;
    };
};

module.exports = ScriptStack;
