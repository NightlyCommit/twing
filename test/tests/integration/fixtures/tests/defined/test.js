const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const TwingTestFoo = require('../../../../../foo');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"defined" test';
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
            definedVar: 'defined',
            zeroVar: 0,
            nullVar: null,
            nested: {
                definedVar: 'defined',
                zeroVar: 0,
                nullVar: null,
                definedArray: [0],
            },
            object: new TwingTestFoo()
        };
    }
};
