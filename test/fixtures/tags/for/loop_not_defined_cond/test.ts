import TwingTestCaseIntegration = require("../../../../../src/test-case/integration");

export = class extends TwingTestCaseIntegration {
    getDescription() {
        return '"for" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The "loop" variable cannot be used in a looping condition in "index.twig" at line 2.'
    }

    getData() {
        return {
            items: [
                'a',
                'b'
            ]
        };
    }
};