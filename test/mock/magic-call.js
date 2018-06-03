module.exports = class {
    constructor() {
        this.toString = '';
    }

    __call() {
        throw new Error('__call shall not be called');
    }
};
