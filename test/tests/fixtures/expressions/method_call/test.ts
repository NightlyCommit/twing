import TwingTestIntegrationTestCase from "../../../../integration-test-case";
import TwingTestFoo from "../../../../foo";

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
                foo: new TwingTestFoo(),
                bar: 'foo'
            }
        }
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }
};