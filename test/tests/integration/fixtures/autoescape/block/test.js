const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'blocks and autoescape';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('unrelated.txt.twig', require('./unrelated.txt.twig'));
        templates.set('template.html.twig', require('./template.html.twig'));
        templates.set('parent.html.twig', require('./parent.html.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            br: '<br />'
        }
    }

    getConfig() {
        return {
            autoescape: 'name'
        }
    }
};
