const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'capturing "block" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {};
    }

    getExpectedDeprecationMessages() {
        return [
            'The "spaceless" tag in "index.twig" at line 4 is deprecated since Twig 2.7, use the "spaceless" filter instead.'
        ];
    }
};
