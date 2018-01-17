import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('parent.twig', require('./parent.twig'));
        templates.set('1_parent.twig', require('./1_parent.twig'));
        templates.set('2_parent.twig', require('./2_parent.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};