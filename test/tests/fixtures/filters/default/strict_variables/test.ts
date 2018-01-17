const TwingTestIntegrationTestCase = require("../test");

export = class extends TwingTestIntegrationTestCase {
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