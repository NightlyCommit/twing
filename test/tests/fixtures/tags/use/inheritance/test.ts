import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent.twig', require('./parent.twig'));
        templates.set('ancestor.twig', require('./ancestor.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};