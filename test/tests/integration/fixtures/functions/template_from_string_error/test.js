const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"template_from_string" function error';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unclosed variable opened at {1:1} in "foo.twig (string template 4900163d56b1af4b704c6b0afee7f98ba53418ce7a93d37a3af1882735baf9cd)" at line 1.'
    }
};
