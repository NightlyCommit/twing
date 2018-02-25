import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'global variables';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('included.twig', require('./included.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};