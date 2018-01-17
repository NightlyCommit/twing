const TwingTestIntegrationTestCase = require("../base");

export = class extends TwingTestIntegrationTestCase {
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