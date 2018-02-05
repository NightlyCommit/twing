import TwingTestIntegrationTestCase from "../../../../../integration-test-case";
import TwingTestFoo from "../../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing supports the ternary operator';
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
            foo: 'foo',
            bar: 'bar'
        }
    }
};