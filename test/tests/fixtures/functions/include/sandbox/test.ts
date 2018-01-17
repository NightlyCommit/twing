import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"include" tag sandboxed';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedFilterError: Filter "e" is not allowed in "foo.twig" at line 4.';
    }
};