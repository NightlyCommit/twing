const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const TwingTestFoo = require('../../../../../foo');

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
