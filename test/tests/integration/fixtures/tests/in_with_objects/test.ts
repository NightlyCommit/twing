import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";
import {TwingTestFoo} from "../../../../../foo";

export = class extends TwingTestIntegrationTestCase {
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