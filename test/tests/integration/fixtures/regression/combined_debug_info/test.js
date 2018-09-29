const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'regression/combined_debug_info';
    }

    getDescription() {
        return 'Exception with bad line number';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo', require('./foo.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Impossible to access an attribute ("bar") on a string variable ("foo") in "foo" at line 3.';
    }

    getData() {
        return {
            foo: 'foo'
        }
    }
};
