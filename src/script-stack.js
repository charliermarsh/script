var bigInt = require('big-integer');
var ecdsa = require('ecdsa');
var config = require('./config.js');
var crypto = require('./crypto.js');

function StackEmptyException() {
    this.toString = () => {
        return 'Attempted to pop from an empty stack.';
    };
}

var serialize = (data) => {
    return data.toString(config.base);
};
var deserialize = (data) => {
    return bigInt(data, config.base);
};

class ScriptStack {
    constructor() { }

    // Basic array operations
    push() {
        var serialized = [].map.call(arguments, serialize);
        return Array.prototype.push.apply(this, serialized);
    }
    pop() {
        if (this.length === 0 || this.length == null) {
            throw new StackEmptyException();
        }
        return deserialize(Array.prototype.pop.apply(this));
    }
    peek() {
        var value = this.pop();
        this.push(value);
        return value;
    }

    // Constants
    OP_0() {
        this.push(0);
    }
    OP_FALSE() {
        this.OP_0();
    }
    OP_1NEGATE() {
        this.OP_1();
        this.OP_NEGATE();
    }
    OP_1() {
        this.push(1);
    }
    OP_TRUE() {
        this.OP_1();
    }

    // Stack operations
    OP_IFDUP() {
        var top = this.peek();
        if (top.compare(0) !== 0) {
            this.push(top);
        }
    }
    OP_DEPTH() {
        this.push(this.length);
    }
    OP_DROP() {
        this.pop();
    }
    OP_2DROP() {
        this.OP_DROP();
        this.OP_DROP();
    }
    OP_DUP(n) {
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
    }
    OP_2DUP() {
        this.OP_DUP(2);
    }
    OP_3DUP() {
        this.OP_DUP(3);
    }
    OP_NIP() {
        var top = this.pop();
        this.pop();
        this.push(top);
    }
    OP_OVER() {
        var top = this.pop();
        var bottom = this.peek();
        this.push(top);
        this.push(bottom);
    }
    OP_PICK() {
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
    }
    OP_ROLL() {
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
    }
    OP_ROT() {
        var values = [this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 1) % values.length]);
        }
    }
    OP_SWAP() {
        var values = [this.pop(), this.pop()];
        for (var i = 0; i < values.length; i++) {
            this.push(values[i]);
        }
    }
    OP_TUCK() {
        var values = [this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length + 1; i++) {
            this.push(values[i % values.length]);
        }
    }
    OP_2OVER() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length + 2; i++) {
            this.push(values[i % values.length]);
        }
    }
    OP_2ROT() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 2) % values.length]);
        }
    }
    OP_2SWAP() {
        var values = [this.pop(), this.pop(), this.pop(), this.pop()];
        values.reverse();
        for (var i = 0; i < values.length; i++) {
            this.push(values[(i + 2) % values.length]);
        }
    }

    // Bitwise logic
    OP_INVERT() {
        this.push(this.pop().not());
    }
    OP_AND() {
        this.push(this.pop().and(this.pop()));
    }
    OP_OR() {
        this.push(this.pop().or(this.pop()));
    }
    OP_XOR() {
        this.push(this.pop().xor(this.pop()));
    }
    OP_EQUAL() {
        var b = this.pop();
        var a = this.pop();
        if (a.equals(b)) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }

    // Artithmetic operations
    OP_1ADD() {
        this.push(this.pop().add(1));
    }
    OP_1SUB() {
        this.push(this.pop().minus(1));
    }
    OP_2MUL() {
        this.push(this.pop().multiply(2));
    }
    OP_2DIV() {
        this.push(this.pop().divide(2));
    }
    OP_NEGATE() {
        this.push(this.pop().multiply(-1));
    }
    OP_ABS() {
        this.push(this.pop().abs());
    }
    OP_NOT() {
        if (this.pop().equals(0)) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_0NOTEQUAL() {
        if (this.pop().equals(0)) {
            this.OP_0();
        } else {
            this.OP_1();
        }
    }
    OP_ADD() {
        var b = this.pop();
        var a = this.pop();
        this.push(a.add(b));
    }
    OP_SUB() {
        var b = this.pop();
        var a = this.pop();
        this.push(a.minus(b));
    }
    OP_MUL() {
        this.push(this.pop().multiply(this.pop()));
    }
    OP_DIV() {
        var divisor = this.pop();
        var dividend = this.pop();
        this.push(dividend.divide(divisor));
    }
    OP_MOD() {
        var divisor = this.pop();
        var dividend = this.pop();
        this.push(dividend.mod(divisor));
    }
    OP_LSHIFT() {
        var numBits = this.pop();
        var value = this.pop();
        this.push(value.shiftLeft(numBits));
    }
    OP_RSHIFT() {
        var numBits = this.pop();
        var value = this.pop();
        this.push(value.shiftRight(numBits));
    }
    OP_BOOLAND() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(0) !== 0 && b.compare(0) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_BOOLOR() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(0) !== 0 || b.compare(0) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_NUMEQUAL() {
        this.OP_EQUAL();
    }
    OP_NUMNOTEQUAL() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) !== 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_LESSTHAN() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) < 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_GREATERTHAN() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) > 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_LESSTHANOREQUAL() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) <= 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_GREATERTHANOREQUAL() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) >= 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }
    OP_MIN() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) <= 0) {
            this.push(a);
        } else {
            this.push(b);
        }
    }
    OP_MAX() {
        var b = this.pop();
        var a = this.pop();
        if (a.compare(b) >= 0) {
            this.push(a);
        } else {
            this.push(b);
        }
    }
    OP_WITHIN() {
        var max = this.pop();
        var min = this.pop();
        var x = this.pop();
        if (x.compare(min) >= 0 && x.compare(max) < 0) {
            this.OP_1();
        } else {
            this.OP_0();
        }
    }

    // Crypto
    OP_RIPEMD160() {
        this.push(crypto.ripemd160(this.pop()));
    }
    OP_SHA1() {
        this.push(crypto.sha1(this.pop()));
    }
    OP_SHA256() {
        this.push(crypto.sha256(this.pop()));
    }
    OP_HASH160() {
        this.push(crypto.ripemd160(crypto.sha256(this.pop())));
    }
    OP_HASH256() {
        this.push(crypto.sha256(crypto.sha256(this.pop())));
    }
    OP_CHECKSIG() {
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
    }
    OP_CHECKMULTISIG() {
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
    }

    // Terminals
    OP_VERIFY() {
        return (this.pop().compare(0) !== 0);
    }
    OP_EQUALVERIFY() {
        this.OP_EQUAL();
        return this.OP_VERIFY();
    }
    OP_CHECKSIGVERIFY() {
        this.OP_CHECKSIG();
        return this.OP_VERIFY();
    }
    OP_CHECKMULTISIGVERIFY() {
        this.OP_CHECKMULTISIG();
        return this.OP_VERIFY();
    }
    OP_RETURN() {
        return false;
    }
};

module.exports = ScriptStack;
