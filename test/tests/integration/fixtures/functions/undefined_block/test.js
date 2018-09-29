const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'functions/undefined_block';
    }

    getDescription() {
        return '"block" function with undefined block';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        // @see https://github.com/twigphp/Twig/issues/2753
        return 'TwingErrorRuntime: Block "unknown" on template "base.twig" does not exist in "index.twig" at line 3.';
    }

    getData() {
        return {};
    }
};
