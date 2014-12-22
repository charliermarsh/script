var to5 = require('6to5');

module.exports = {
    process: function(src, path) {
        // script.js is Jison output, which doesn't conform to strict mode
        // but is already valid ES5
        if (path.indexOf('node_modules') === -1 && path.indexOf('script.js') === -1) {
            src = to5.transform(src, {
                modules: 'common'
            }).code;
        }
        return src;
    }
};
