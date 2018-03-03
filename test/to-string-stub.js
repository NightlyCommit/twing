module.exports = class TwingTestToStringStub {
    constructor(value) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}
