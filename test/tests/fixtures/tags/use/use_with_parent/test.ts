import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"use" tag with a parent block';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent.twig', require('./parent.twig'));
        templates.set('blocks.twig', require('./blocks.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};