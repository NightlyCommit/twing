const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"extends" tag using an array with an empty name'
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('bar.twig', require('./bar.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
