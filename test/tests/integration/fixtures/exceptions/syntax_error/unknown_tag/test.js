const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'exceptions/syntax_error/unknown_tag';
    }

    getDescription() {
        return 'Exception for an unknown tag syntax error';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "includes" tag. Did you mean "include" in "index.twig" at line 1?';
    }
};
