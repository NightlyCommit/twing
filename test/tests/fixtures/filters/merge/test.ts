import TwingTestIntegrationTestCase from "../../../../integration-test-case";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"merge" filter';
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
        let traversable: Map<any, any> = new Map();

        traversable.set('a', [1, 2, 3]);
        traversable.set('b', new Map([
            ['a', 'b']
        ]));

        return {
            items: {
                foo: 'bar'
            },
            numerics: [1, 2, 3],
            traversable: traversable
        }
    }
};