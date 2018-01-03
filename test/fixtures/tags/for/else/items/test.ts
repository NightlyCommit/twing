import TwingTestCaseIntegration = require("../base");

export = class extends TwingTestCaseIntegration {
    getData() {
        return {
            items: [
                'a',
                'b'
            ]
        };
    }

    getExpected() {
        return require('./expected.html');
    }
};