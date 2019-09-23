const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"sandbox" tag with non-allowed filter';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getConfig() {
        return {
            autoescape: false
        }
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFilterError: Filter "upper" is not allowed in "foo.twig" at line 1.';
    }
};
