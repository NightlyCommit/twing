const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"name" autoescape strategy';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('index.txt.twig', require('./index.txt.twig'));
        templates.set('index.html.twig', require('./index.html.twig'));
        templates.set('index.js.twig', require('./index.js.twig'));

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
