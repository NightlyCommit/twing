const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'tags/include/missing_nested';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "foo.twig" is not defined in "base.twig" at line 3.'
    }
};
