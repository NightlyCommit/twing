const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"sandbox" tag support array';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getConfig() {
        return {
            autoescape: false,
            debug: true
        }
    }

    getData() {
        return {
          'a': 'b'
        };
    }

    getSandboxSecurityPolicyFunctions() {
        return ['dump'];
    }
};
