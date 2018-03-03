const TwingTestIntegrationTestCaseBase = require('../base');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getData() {
        let items = [];

        return {
            items: items
        };
    }

    getExpected() {
        return require('./expected.html');
    }
};
