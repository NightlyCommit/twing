/**
 * This class is used in tests for the length filter and empty test to show
 * that when \Countable is implemented, it is preferred over the __toString()
 * method.
 */
module.exports = class {
    constructor(count) {
        this.length = count;
    }

    toString() {
        throw new Error('toString shall not be called on Countables');
    }
};
