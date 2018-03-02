const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"with" tag with expression and only';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable "baz" does not exist in "index.twig" at line 3.';
    }

    getData() {
        return {
            foo: 'baz',
            baz: 'baz'
        }
    }
};
