const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const TwingTestFoo = require('../../../../../foo');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"default" filter';
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
            emptyVar: '',
            nullVar: null,
            nested: {
                definedVar: 'defined',
                zeroVar: 0,
                emptyVar: '',
                nullVar: null,
                definedArray: [0],
            },
            object: new TwingTestFoo(),
        };
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }
};
