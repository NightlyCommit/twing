const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"include" tag throws an error when passed undefined data and strict_variables is set to false';
    }

    getConfig() {
        return {
            strict_variables: false
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variables passed to the "include" function or tag must be iterable, got "null" in "index.twig" at line 1.';
    }
};
