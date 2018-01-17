import TwingTestIntegrationTestCase from "../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Exception for multiline function with undefined variable';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo', require('./foo.twig'));

        return templates;
    }

    getData() {
        return {
            foobar: 'foobar'
        }
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable "with_context" does not exist in "index.twig" at line 3.';
    }
};