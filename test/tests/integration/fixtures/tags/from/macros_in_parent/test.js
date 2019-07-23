const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'macros in parent';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('macros', require('./macros.twig'));
        templates.set('parent', require('./parent.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};
