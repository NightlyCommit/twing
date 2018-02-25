import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";
import {TwingTestFoo} from "../../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"join" filter';
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
            foo: new TwingTestFoo(),
            bar: [3, 4]
        }
    }
};
