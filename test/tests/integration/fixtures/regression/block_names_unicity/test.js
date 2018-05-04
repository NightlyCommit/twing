const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Block names are unique per template';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('layout', require('./layout.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
