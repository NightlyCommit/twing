const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Exception for invalid argument type in replace call';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: The "replace" filter expects an hash or "Iterable" as replace values, got "boolean" in "index.twig" at line 2.';
    }

    getData() {
        return {
            stdClass: false
        }
    }
};
