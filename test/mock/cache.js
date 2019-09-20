const TwingTestMockTemplate = require('./template');

module.exports = class TwingTestMockCache {
    constructor() {
        this.TwingCacheInterfaceImpl = this;
    }

    generateKey(name, className) {
        return 'key'
    }

    write(key, content) {

    }

    load(key) {
        let templates = new Map([
            [0, TwingTestMockTemplate]
        ]);

        return () => {
            return templates;
        };
    }

    getTimestamp(key) {
        return 0;
    }
};
