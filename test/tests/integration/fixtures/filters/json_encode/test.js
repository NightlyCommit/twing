const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingMarkup} = require('../../../../../../dist/lib/markup');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"json_encode" filter';
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
            foo: new TwingMarkup('foo', 'UTF-8')
        };
    }
};
