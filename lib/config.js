var sha256 = require('sha256');

var keyword = 'Secure';

module.exports = {
    nonce: new Buffer(sha256(new Buffer(keyword, 'utf8')), 'hex'),
    base: 16
};
