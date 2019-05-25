const TwingTestMockTemplate = require('./template');

module.exports = class TwingTestMockCache {
    constructor() {
        this.TwingCacheInterfaceImpl = this;
    }

    generateKey(name, hash) {
        return 'key'
    }

    write(key, content) {

    }

    load(key) {
        let templates = {};

        templates['main'] = TwingTestMockTemplate;

        return () => {
            return templates;
        };
    }

    getTimestamp(key) {
        return 0;
    }
};
