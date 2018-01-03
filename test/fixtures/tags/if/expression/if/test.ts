import TwingTestCaseIntegration = require("../../../../../../src/test-case/integration");

export = class extends TwingTestCaseIntegration {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('../index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            a: 1
        };
    }
};