const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

// fake XML class to ensure that any iterator is supported
class SimpleXMLElement {
    constructor(xml) {
        this.xml = xml;

        this[Symbol.iterator] = function* () {
            yield 1;
            yield 2;
        }
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
