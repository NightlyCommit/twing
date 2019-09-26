const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

/**
 * @see https://github.com/NightlyCommit/twing/issues/236
 * @type {module.exports}
 */
module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"batch" filter on undefined variable';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getConfig() {
        return {
            strict_variables: false
        };
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {};
    }
};
