const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'macro call in embed with local macro';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('embed', require('./embed.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "input" function in "index.twig" at line 6.';
    }
};
