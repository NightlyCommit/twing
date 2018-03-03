const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"with" tag with an expression that is not a hash';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variables passed to the "with" tag must be a hash in "index.twig" at line 2.';
    }

    getData() {
        return {
            vars: 'no-hash'
        }
    }
};
