const TwingTestIntegrationTestCaseBase = require('../../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"sandbox" tag checks implicit toString calls';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingSandboxSecurityNotAllowedMethodError: Calling "toString" method on a "Object" object is not allowed in "foo.twig".';
    }

    getExtensions() {
        return super.getExtensions(true);
    }

    getConfig() {
        return {
            autoescape: false
        };
    }

    getData() {
        return {
            article: {
                toString: () => {
                    return 'Article';
                }
            }
        }
    }
};
