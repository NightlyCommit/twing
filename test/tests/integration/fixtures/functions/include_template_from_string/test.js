const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"template_from_string" function works in an "include"';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('embed.twig', require('./embed.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
