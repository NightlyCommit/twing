const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"batch" filter on undefined variable with strict variables set';
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `items` does not exist in "index.twig" at line 1.';
    }

    getConfig() {
        return {
            strict_variables: true
        };
    }
};
