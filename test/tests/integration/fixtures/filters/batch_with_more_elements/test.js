const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"batch" filter with more elements';
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
            items: new Map([
                ['a', 'a'],
                ['b', 'b'],
                ['c', 'c'],
                ['d', 'd'],
                ['123', 'e'],
            ])
        }
    }
};
