import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"block" function';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};