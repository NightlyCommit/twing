const {TwingSource} = require('../../dist/lib/source');

module.exports = class {
    getSourceContext(name) {
        return new TwingSource('', '', '');
    }

    getCacheKey(name) {
        return '';
    }

    isFresh(name, time) {
        return true;
    }

    exists(name) {
        return true;
    }
};
