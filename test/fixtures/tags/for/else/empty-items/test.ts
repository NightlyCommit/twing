import TwingTestCaseIntegration = require("../base");

export = class extends TwingTestCaseIntegration {
    getData() {
        let items: Array<any> = [];

        return {
            items: items
        };
    }

    getExpected() {
        return require('./expected.html');
    }
};