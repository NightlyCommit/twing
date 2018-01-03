import TwingTestCaseIntegration = require("../base");

export = class extends TwingTestCaseIntegration {
    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            foo: false
        }
    }
};