/* description: Parses end executes mathematical expressions. */

%{
    var ripemd160 = function(data) {
        return require('ripemd160')(data).toString('hex');
    };
    var sha1 = require('sha1');
    var sha256 = require('sha256');
    var serialize = function(data) {
        return parseInt(data, 16);
    };
%}

/* lexical grammar */
%lex

%%
\s+                       { /* skip whitespace */ }
"OP_NOP"                  { /* skip no-ops */ }
0x([0-9]|[A-F]|[a-f])+\b  { return 'DATA'; }
/* Constants */
"OP_1"                    { return 'OP_1'; }
/* Flow control */
"OP_VERIFY"               { return 'OP_VERIFY'; }
"OP_RETURN"               { return 'OP_RETURN'; }
/* Stack */
"OP_DROP"                 { return 'OP_DROP'; }
"OP_DUP"                  { return 'OP_DUP'; }
/* Bitwise logic */
"OP_EQUAL"                { return 'OP_EQUAL'; }
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
            var js = 'var stack = [];' + $e;
            console.log(js);
            console.log(eval(js));
        %}
    ;

e
    : DATA e
        %{
            $$ = 'stack.push(serialize(' + $1 + '));' + $e;
        %}
    | OP_1 e
        %{
            $$ = 'stack.push(1);' + $e;
        %}
    | OP_VERIFY
        %{
            $$ = '(stack.pop() != 0);';
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
    | OP_EQUAL e
        %{
            $$ = 'if (stack.pop() === stack.pop()) { stack.push(1); } else { stack.push(0); }; ' + $e;
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