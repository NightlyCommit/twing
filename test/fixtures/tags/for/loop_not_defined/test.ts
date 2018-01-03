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
        return 'TwingErrorSyntax: The "loop.last" variable is not defined when looping with a condition in "index.twig" at line 3.'
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