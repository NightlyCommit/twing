const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"use" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('file1.html.twig', require('./file1.html.twig'));
        templates.set('file2.html.twig', require('./file2.html.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
