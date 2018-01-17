import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('file1.html.twig', require('./file1.html.twig'));
        templates.set('file2.html.twig', require('./file2.html.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};