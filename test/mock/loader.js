const TwingSource = require('../../lib/twing/source').TwingSource;

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
