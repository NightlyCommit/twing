const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
        let traversable = new Map();

        traversable.set('a', [1, 2, 3]);
        traversable.set('b', new Map([
            ['a', 'b']
        ]));

        return {
            items: new Map([
                ['foo', 'bar']
            ]),
            numerics: [1, 2, 3],
            traversable: traversable
        }
    }
};
