const TwingTestMockTemplate = require('./template');

module.exports = class {
    constructor() {
        this.TwingIsCache = true;
    }

    generateKey(name, className) {
        return 'key'
    }

    write(key, content) {

    }

    load(key) {
        let templates = {};

        templates['__TwingTemplate_foo'] = TwingTestMockTemplate;

        return templates;
    }

    getTimestamp(key) {
        return 0;
    }
};
