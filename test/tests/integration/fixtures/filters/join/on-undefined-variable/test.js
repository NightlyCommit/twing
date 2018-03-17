const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"join" filter on undefined variable';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getConfig() {
        return {
            strict_variables: false
        }
    }

    getData() {
        return {};
    }

    getExpected() {
        return require('./expected.html');
    }
};
