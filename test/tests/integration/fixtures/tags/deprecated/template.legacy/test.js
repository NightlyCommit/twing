const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Deprecating a template with "deprecated" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('greeting.twig', require('./greeting.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getExpectedDeprecationMessages() {
        return [
            'The "index.twig" template is deprecated, use "greeting.twig" instead. ("index.twig" at line 3)'
        ];
    }
};
