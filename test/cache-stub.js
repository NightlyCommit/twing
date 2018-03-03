module.exports = class TwingTestCacheStub {
    constructor() {
        this.implementsTwingCacheInterface = true;
    }

    generateKey(name, className) {
        return 'key'
    }

    write(key, content) {

    }

    load(key) {
        return null;
    }

    getTimestamp(key) {
        return 0;
    }
}
