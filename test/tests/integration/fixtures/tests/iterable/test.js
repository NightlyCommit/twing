const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
        let foo = [];
        let traversable = new Map([[0, []]]);

        return {
            foo: foo,
            traversable: traversable,
            obj: new Object(),
            val: 'test'
        }
    }
};
