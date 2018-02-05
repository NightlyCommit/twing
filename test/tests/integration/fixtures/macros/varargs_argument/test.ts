import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'macro with varargs argument';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The argument "varargs" in macro "test" cannot be defined because the variable "varargs" is reserved for arbitrary arguments in "index.twig" at line 2.';
    }
};