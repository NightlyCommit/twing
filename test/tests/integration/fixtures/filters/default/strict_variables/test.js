const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"default" filter with strict variables set';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('../index.twig'));

        return templates;
    }

    getExpected() {
        return require('../expected.html');
    }

    getConfig() {
        return {
            strict_variables: true
        }
    }
};
