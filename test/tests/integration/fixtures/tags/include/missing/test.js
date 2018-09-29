const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'tags/include/missing';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "foo.twig" is not defined in "index.twig" at line 1.';
    }
};
