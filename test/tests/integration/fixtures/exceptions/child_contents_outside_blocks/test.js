const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Exception for child templates defining content outside blocks defined by parent';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: A template that extends another one cannot include content outside Twig blocks. Did you forget to put the content inside a {% block %} tag in "index.twig" at line 3?';
    }
};
