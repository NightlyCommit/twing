const TwingTestIntegrationTestCaseBase = require('../base');

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
