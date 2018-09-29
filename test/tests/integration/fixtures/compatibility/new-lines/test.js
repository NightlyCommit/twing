const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'compatibility/new-lines';
    }

    getDescription() {
        return 'all flavors of new lines are rendered as line feeds';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', '\r\rfoo\r\nbar\roof\n\r');

        return templates;
    }

    getExpected() {
        return '\n\nfoo\nbar\noof\n\n';
    }
};
