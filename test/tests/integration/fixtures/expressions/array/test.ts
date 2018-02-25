import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing supports array notation';
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
            bar: 'bar',
            foo: new Map([['bar', 'bar']])
        }
    }
};