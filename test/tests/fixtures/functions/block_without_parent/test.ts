import TwingTestIntegrationTestCase from "../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"block" calling parent() with no definition in parent template';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent.twig', require('./parent.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Block "label" should not call parent() in "index.twig" as the block does not exist in the parent template "parent.twig" in "index.twig" at line 3.';
    }
};