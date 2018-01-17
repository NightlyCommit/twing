const TwingTestIntegrationTestCase = require("../base");

export = class extends TwingTestIntegrationTestCase {
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