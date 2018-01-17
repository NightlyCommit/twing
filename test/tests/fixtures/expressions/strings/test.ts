import TwingTestIntegrationTestCase from "../../../../integration-test-case";
import TwingTestFoo from "../../../../foo";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twing supports string interpolation';
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
            bar: 'BAR'
        }
    }
};