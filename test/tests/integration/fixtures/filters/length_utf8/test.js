const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingMarkup} = require('../../../../../../dist/lib/markup');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"length" filter';
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
            string: 'été',
            markup: new TwingMarkup('foo', 'UTF-8')
        };
    }
};
