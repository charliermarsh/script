var parser = require('./script.js').parser;

module.exports = function(input) {
    return parser.parse(input);
};
