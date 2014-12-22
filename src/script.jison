/* description: Compiles Bitcoin Script to JavaScript. */

%{
    var beautify = require('js-beautify').js_beautify;
    var base = require('./config.js').base;
    var ScriptStack = require('./script-stack.js');
%}

/* lexical grammar */
%lex

%%
\s+                          { /* skip whitespace */ }
(0x)?([0-9]|[A-F]|[a-f])+\b  { return 'DATA'; }
/* Constants */
"OP_0"                       { return 'OP_FUNCTION'; }
"OP_FALSE"                   { return 'OP_FUNCTION'; }
"OP_1NEGATE"                 { return 'OP_FUNCTION'; }
"OP_1"                       { return 'OP_FUNCTION'; }
"OP_TRUE"                    { return 'OP_FUNCTION'; }
OP_([2-9]|1[0-6])\b          { return 'DATA'; }
/* Flow control */
"OP_NOP"                     { return 'OP_NOP'; }
"OP_IF"                      { return 'OP_IF'; }
"OP_NOTIF"                   { return 'OP_NOTIF'; }
"OP_ELSE"                    { return 'OP_ELSE'; }
"OP_ENDIF"                   { return 'OP_ENDIF'; }
"OP_VERIFY"                  { return 'OP_TERMINAL'; }
"OP_RETURN"                  { return 'OP_TERMINAL'; }
"OP_EQUALVERIFY"             { return 'OP_TERMINAL'; }
"OP_CHECKSIGVERIFY"          { return 'OP_TERMINAL'; }
"OP_CHECKMULTISIGVERIFY"     { return 'OP_TERMINAL'; }
/* Stack */
"OP_IFDUP"                   { return 'OP_FUNCTION'; }
"OP_DEPTH"                   { return 'OP_FUNCTION'; }
"OP_DROP"                    { return 'OP_FUNCTION'; }
"OP_DUP"                     { return 'OP_FUNCTION'; }
"OP_NIP"                     { return 'OP_FUNCTION'; }
"OP_OVER"                    { return 'OP_FUNCTION'; }
"OP_PICK"                    { return 'OP_FUNCTION'; }
"OP_ROLL"                    { return 'OP_FUNCTION'; }
"OP_ROT"                     { return 'OP_FUNCTION'; }
"OP_SWAP"                    { return 'OP_FUNCTION'; }
"OP_TUCK"                    { return 'OP_FUNCTION'; }
"OP_2DROP"                   { return 'OP_FUNCTION'; }
"OP_2DUP"                    { return 'OP_FUNCTION'; }
"OP_3DUP"                    { return 'OP_FUNCTION'; }
"OP_2OVER"                   { return 'OP_FUNCTION'; }
"OP_2ROT"                    { return 'OP_FUNCTION'; }
"OP_2SWAP"                   { return 'OP_FUNCTION'; }
/* Bitwise logic */
"OP_INVERT"                  { return 'OP_FUNCTION'; }
"OP_AND"                     { return 'OP_FUNCTION'; }
"OP_OR"                      { return 'OP_FUNCTION'; }
"OP_XOR"                     { return 'OP_FUNCTION'; }
"OP_EQUAL"                   { return 'OP_FUNCTION'; }
/* Arithmetic */
"OP_1ADD"                    { return 'OP_FUNCTION'; }
"OP_1SUB"                    { return 'OP_FUNCTION'; }
"OP_2MUL"                    { return 'OP_FUNCTION'; }
"OP_2DIV"                    { return 'OP_FUNCTION'; }
"OP_NEGATE"                  { return 'OP_FUNCTION'; }
"OP_ABS"                     { return 'OP_FUNCTION'; }
"OP_NOT"                     { return 'OP_FUNCTION'; }
"OP_0NOTEQUAL"               { return 'OP_FUNCTION'; }
"OP_ADD"                     { return 'OP_FUNCTION'; }
"OP_SUB"                     { return 'OP_FUNCTION'; }
"OP_MUL"                     { return 'OP_FUNCTION'; }
"OP_DIV"                     { return 'OP_FUNCTION'; }
"OP_MOD"                     { return 'OP_FUNCTION'; }
"OP_LSHIFT"                  { return 'OP_FUNCTION'; }
"OP_RSHIFT"                  { return 'OP_FUNCTION'; }
"OP_BOOLAND"                 { return 'OP_FUNCTION'; }
"OP_BOOLOR"                  { return 'OP_FUNCTION'; }
"OP_NUMEQUAL"                { return 'OP_FUNCTION'; }
"OP_NUMNOTEQUAL"             { return 'OP_FUNCTION'; }
"OP_LESSTHAN"                { return 'OP_FUNCTION'; }
"OP_GREATERTHAN"             { return 'OP_FUNCTION'; }
"OP_LESSTHANOREQUAL"         { return 'OP_FUNCTION'; }
"OP_GREATERTHANOREQUAL"      { return 'OP_FUNCTION'; }
"OP_MIN"                     { return 'OP_FUNCTION'; }
"OP_MAX"                     { return 'OP_FUNCTION'; }
"OP_WITHIN"                  { return 'OP_FUNCTION'; }
/* Crypto */
"OP_RIPEMD160"               { return 'OP_FUNCTION'; }
"OP_SHA1"                    { return 'OP_FUNCTION'; }
"OP_SHA256"                  { return 'OP_FUNCTION'; }
"OP_HASH160"                 { return 'OP_FUNCTION'; }
"OP_HASH256"                 { return 'OP_FUNCTION'; }
"OP_CHECKSIG"                { return 'OP_FUNCTION'; }
"OP_CHECKMULTISIG"           { return 'OP_FUNCTION'; }
<<EOF>>                      { return 'EOF'; }

/lex

%nonassoc OP_ELSE
%nonassoc OP_ENDIF

%start script

%% /* language grammar */

script
    : nonterm EOF
        %{
            var js = beautify($1);
            var evaluate = new Function('stack', js);

            // If the script is non-terminating, add an OP_VERIFY at the end
            var terminates = evaluate(new ScriptStack()) != null;
            if (!terminates) {
                js = beautify($1 + 'return stack.OP_VERIFY();');
                evaluate = new Function('stack', js);
            }

            return {
                value: evaluate(new ScriptStack()),
                code: js
            };
        %}
    ;

nonterm
    : opcode
    | nonterm opcode
        %{
            $$ = $1 + $2;
        %}
    ;

opcode
    : DATA
        %{
            var value;
            if ($1.indexOf('OP_') !== -1) {
                // These statements encrypt their value as decimal, so convert
                value = parseInt($1.substr('OP_'.length)).toString(base);
            } else if ($1.indexOf('0x') !== -1) {
                // Otherwise, conversion takes place anyway when you push
                value = $1.substr('0x'.length);
            } else {
                value = $1;
            }
            $$ = 'stack.push("' + value + '");';
        %}
    | OP_TERMINAL
        %{
            $$ = 'return stack.' + $1  + '();'
        %}
    | OP_IF nonterm OP_ELSE nonterm OP_ENDIF
        %{
            $$ = 'if (stack.pop().compare(0) !== 0) {' + $nonterm1 + '} else {' + $nonterm2 + '}';
        %}
    | OP_IF nonterm OP_ENDIF
        %{
            $$ = 'if (stack.pop().compare(0) !== 0) {' + $nonterm + '}';
        %}
    | OP_NOTIF nonterm OP_ELSE nonterm OP_ENDIF
        %{
            $$ = 'if (stack.pop().equals(0)) {' + $nonterm1 + '} else {' + $nonterm2 + '}';
        %}
    | OP_NOTIF nonterm OP_ENDIF
        %{
            $$ = 'if (stack.pop().equals(0)) {' + $nonterm + '}';
        %}
    | OP_NOP
        %{
            $$ = '';
        %}
    | OP_FUNCTION
        %{
            $$ = 'stack.' + $1  + '();'
        %}
    ;
