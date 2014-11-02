/* description: Parses end executes mathematical expressions. */

%{
    var base = 16;
    var debug = false;

    // Crypto
    var ripemd160 = function(data) {
        data = data.toString(base);
        return require('ripemd160')(data).toString('hex');
    };
    var sha1 = function(data) {
        data = data.toString(base);
        return require('sha1')(data);
    };
    var sha256 = function(data) {
        data = data.toString(base);
        return require('sha256')(data);
    };

    // Other utilities
    var bigInt = require('big-integer');
    var beautify = require('js-beautify').js_beautify;
    var serialize = function(data) {
        return data.toString(base);
    };
    var deserialize = function(data) {
        return bigInt(data, base);
    };

    // Setup
    var stack = [];
    stack.push = function() {
        debug && console.log("Pre-push:", this);
        var serialized = [].map.call(arguments, serialize);
        Array.prototype.push.apply(this, serialized);
        debug && console.log("Post-push:", this);
    };
    stack.pop = function() {
        debug && console.log("Pre-pop:", this);
        var result = deserialize(Array.prototype.pop.apply(this));
        debug && console.log("Post-pop:", this);
        return result;
    };
%}

/* lexical grammar */
%lex

%%
\s+                       { /* skip whitespace */ }
"OP_NOP"                  { /* skip no-ops */ }
0x([0-9]|[A-F]|[a-f])+\b  { return 'DATA'; }
/* Constants */
"OP_0"                    { return 'OP_0'; }
"OP_FALSE"                { return 'OP_0'; }
"OP_1"                    { return 'OP_1'; }
"OP_TRUE"                 { return 'OP_1'; }
/* Flow control */
"OP_VERIFY"               { return 'OP_VERIFY'; }
"OP_RETURN"               { return 'OP_RETURN'; }
/* Stack */
"OP_DROP"                 { return 'OP_DROP'; }
"OP_DUP"                  { return 'OP_DUP'; }
"OP_SWAP"                 { return 'OP_SWAP'; }
/* Bitwise logic */
"OP_EQUAL"                { return 'OP_EQUAL'; }
/* Arithmetic */
"OP_1ADD"                 { return 'OP_1ADD'; }
"OP_1SUB"                 { return 'OP_1SUB'; }
"OP_NEGATE"               { return 'OP_NEGATE'; }
"OP_ABS"                  { return 'OP_ABS'; }
/* Crypto */
"OP_RIPEMD160"            { return 'OP_RIPEMD160'; }
"OP_SHA1"                 { return 'OP_SHA1'; }
"OP_SHA256"               { return 'OP_SHA256'; }
"OP_HASH160"              { return 'OP_HASH160'; }
"OP_HASH256"              { return 'OP_HASH256'; }
<<EOF>>                   { return 'EOF'; }

/lex

%right OP_EQUAL

%start expressions

%% /* language grammar */

expressions
    : e EOF
        %{
            var js = beautify($e);
            return eval(js);
        %}
    ;

e
    : DATA e
        %{
            $$ = 'stack.push(' + $1 + ');' + $e;
        %}
    | OP_0 e
        %{
            $$ = 'stack.push(0);' + $e;
        %}
    | OP_1 e
        %{
            $$ = 'stack.push(1);' + $e;
        %}
    | OP_VERIFY
        %{
            $$ = 'stack.pop().compare(0) !== 0;';
        %}
    | OP_RETURN
        %{
            $$ = 'false;';
        %}
    | OP_DROP e
        %{
            $$ = 'stack.pop();' + $e;
        %}
    | OP_DUP e
        %{
            $$ = 'var data = stack.pop(); stack.push(data); stack.push(data);' + $e;
        %}
    | OP_SWAP e
        %{
            $$ = 'var u = stack.pop(); var v = stack.pop(); stack.push(u); stack.push(v);' + $e;
        %}
    | OP_EQUAL e
        %{
            $$ = 'if (stack.pop().equals(stack.pop())) { stack.push(1); } else { stack.push(0); }; ' + $e;
        %}
    | OP_1ADD e
        %{
            $$ = 'stack.push(stack.pop().add(1));' + $e;
        %}
    | OP_1SUB e
        %{
            $$ = 'stack.push(stack.pop().minus(1));' + $e;
        %}
    | OP_NEGATE e
        %{
            $$ = 'stack.push(stack.pop().multiply(-1));' + $e;
        %}
    | OP_ABS e
        %{
            $$ = 'stack.push(stack.pop().abs());' + $e;
        %}
    | OP_RIPEMD160 e
        %{
            $$ = 'stack.push(ripemd160(stack.pop()));' + $e;
        %}
    | OP_SHA1 e
        %{
            $$ = 'stack.push(sha1(stack.pop()));' + $e;
        %}
    | OP_SHA256 e
        %{
            $$ = 'stack.push(sha256(stack.pop()));' + $e;
        %}
    | OP_HASH160 e
        %{
            $$ = 'stack.push(ripemd160(sha256(stack.pop())));' + $e;
        %}
    | OP_HASH256 e
        %{
            $$ = 'stack.push(sha256(sha256(stack.pop())));' + $e;
        %}
    ;