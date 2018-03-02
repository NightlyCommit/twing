const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"constant" test';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getGlobals() {
        let result = new Map();

        result.set('E_NOTICE', 8);
        result.set('TwigTestFoo::BAR_NAME', 'bar');
        result.set('Array', {
            ARRAY_AS_PROPS: 2
        });

        return result
    }

    getData() {
        return {
            value: 'bar',
            object: ['hi']
        };
    }
};
