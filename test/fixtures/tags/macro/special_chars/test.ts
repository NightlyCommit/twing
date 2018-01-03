import TwingTestCaseIntegration = require("../../../../../src/test-case/integration");

export = class extends TwingTestCaseIntegration {
    getDescription() {
        return '"§" as a macro name';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }
};