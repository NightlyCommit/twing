const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Exception for multiline array with undefined variable';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getData() {
        return {
            foobar: 'foobar'
        }
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable "foo2" does not exist in "index.twig" at line 11.';
    }
};
