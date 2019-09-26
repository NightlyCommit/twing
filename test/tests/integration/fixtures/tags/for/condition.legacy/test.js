const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"for" tag takes a condition';
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
        return {
            foo: {
                bar: 'X'
            }
        };
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }

    getExpectedDeprecationMessages() {
        return [
            'Using an "if" condition on "for" tag in "index.twig" at line 2 is deprecated since Twig 2.10.0, use a "filter" filter or an "if" condition inside the "for" body instead (if your condition depends on a variable updated inside the loop).'
        ];
    }
};
