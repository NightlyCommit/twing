const TwingTestIntegrationTestCaseBase = require('../../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('../index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            a: 7
        };
    }
};
