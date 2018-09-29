const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'exceptions/strict_comparison_operator/not_equal';
    }

    getDescription() {
        return 'The !== strict comparison operator is not supported';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected operator of value "=". Did you try to use "===" or "!==" for strict comparison? Use "is same as(value)" instead in "index.twig" at line 2.';
    }
};
