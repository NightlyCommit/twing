import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"with" tag with expression and only\n';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable "baz" does not exist in "index.twig" at line 3.';
    }

    getData() {
        return {
            vars: 'no-hash'
        }
    }
};