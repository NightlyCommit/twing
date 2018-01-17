import TwingTestIntegrationTestCase from "../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing supports method calls';
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
            foo: 'bar',
            items: {
                foo: 'bar',
                bar: 'foo'
            }
        }
    }
};