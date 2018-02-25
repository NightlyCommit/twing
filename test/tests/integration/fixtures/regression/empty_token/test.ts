import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twig outputs 0 nodes correctly';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            foo: 'foo'
        }
    }
};