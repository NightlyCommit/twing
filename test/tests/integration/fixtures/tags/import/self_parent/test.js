const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"import" tag self parent';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent', require('./parent.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
