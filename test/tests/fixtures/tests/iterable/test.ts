import TwingTestIntegrationTestCase from "../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"iterable" test';
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
        let foo: Array<any> = [];
        let traversable: Map<any, any> = new Map([[0, []]]);

        return {
            foo: foo,
            traversable: traversable,
            obj: {},
            val: 'test'
        }
    }
};