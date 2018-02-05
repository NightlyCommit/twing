import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Exception for child templates defining contents outside blocks defined by parent';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: A template that extends another one cannot include contents outside Twig blocks. Did you forget to put the contents inside a {% block %} tag in "index.twig" at line 3?';
    }
};