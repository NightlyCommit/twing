import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

// fake XML class to ensure that any iterator is supported
class SimpleXMLElement {
    private xml: string;

    constructor(xml: string) {
        this.xml = xml;
    }

    [Symbol.iterator] = function* () {
        yield 1;
        yield 2;
    }
}

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"slice" filter';
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
            start: 1,
            length: 2,
            arr: [1, 2, 3, 4],
            xml: new SimpleXMLElement('<items><item>1</item><item>2</item></items>'),
        }
    }
};