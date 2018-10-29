const TwingTestIntegrationTestCaseBase = require('../test');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"include" tag throws an error when passed undefined data and strict_variables is set to false';
    }

    getName() {
        return 'tags/include/with_undefined_variables/no_strict_variables';
    }

    getConfig() {
        return {
            strict_variables: false
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: An exception has been thrown during the rendering of a template ("Argument 1 passed to TwingTemplate::display() must be an iterator, null given") in "index.twig".';
    }
};
