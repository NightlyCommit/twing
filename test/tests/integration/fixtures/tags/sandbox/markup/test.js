const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');
const {TwingMarkup} = require('../../../../../../../dist/cjs/lib/markup');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"sandbox" tag ignore TwingMarkup';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getExtensions() {
        return super.getExtensions(true);
    }

    getConfig() {
        return {
            autoescape: false
        };
    }

    getData() {
        return {
            markup: new TwingMarkup('Foo', 'utf-8')
        }
    }
};
