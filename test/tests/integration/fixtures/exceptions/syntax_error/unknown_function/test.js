const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'exceptions/syntax_error/unknown_function';
    }

    getDescription() {
        return 'Exception for an unknown function syntax error';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "includes" function. Did you mean "include" in "index.twig" at line 1?';
    }
};
