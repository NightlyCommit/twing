const TwingTestIntegrationTestCaseBase = require('../base');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getExpected() {
        return require('./expected.html');
    }
};
