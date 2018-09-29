const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'exceptions/multiline_array_with_undefined_variable_again';
    }

    getDescription() {
        return 'Exception for multiline array with undefined variable';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `foobar` does not exist in "index.twig" at line 7.';
    }
};
