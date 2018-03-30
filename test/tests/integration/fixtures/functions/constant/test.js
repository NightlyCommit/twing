const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

const DATE_W3C = 'DATE_W3C';

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"constant" function';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getGlobals() {
        let result = new Map();

        result.set(DATE_W3C, DATE_W3C);
        result.set('Map', new Map([
            ['ARRAY_AS_PROPS', 2]
        ]));

        return result;
    }

    getData() {
        return {
            expect: DATE_W3C,
            object: new Map([[0, 'hi']])
        }
    }
};
