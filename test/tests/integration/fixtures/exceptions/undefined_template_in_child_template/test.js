const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Exception for an undefined template in a child template';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "include.twig" is not defined in "index.twig" at line 5.';
    }
};
