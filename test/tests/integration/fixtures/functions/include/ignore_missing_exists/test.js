const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"include" function with ignore_missing and missing included template in included template';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('included.twig', require('./included.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "DOES NOT EXIST" is not defined in "included.twig" at line 2.';
    }
};
