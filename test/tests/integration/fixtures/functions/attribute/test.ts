import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";
import {TwingTestFoo} from "../../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"attribute" function';
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
            obj: new TwingTestFoo(),
            method: 'foo',
            array: {foo: 'bar'},
            item: 'foo',
            nonmethod: 'xxx',
            arguments: ['a', 'b']
        }
    }
};