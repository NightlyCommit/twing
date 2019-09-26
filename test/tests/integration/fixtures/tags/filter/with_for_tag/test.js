const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"filter" tag applies the filter on "for" tags';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getExpectedDeprecationMessages() {
        return [
            'The "filter" tag in "index.twig" at line 2 is deprecated since Twig 2.9, use the "apply" tag instead.'
        ];
    }

    getData() {
        return {
            items: [
                'a',
                'b'
            ]
        }
    }
};
