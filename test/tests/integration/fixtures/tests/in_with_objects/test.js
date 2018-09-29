const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const TwingTestFoo = require('../../../../../foo');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'tests/in_with_objects';
    }

    getDescription() {
        return 'Twing supports the in operator when using objects';
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
        let foo = new TwingTestFoo();
        let foo1 = new TwingTestFoo();

        // ???
        // foo.position = foo1;
        // foo1.position = foo;

        return {
            object: foo,
            object_list: [foo1, foo],
        };
    }
};
