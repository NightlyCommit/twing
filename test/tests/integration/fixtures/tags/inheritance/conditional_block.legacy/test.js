const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'conditional "block" tag with "extends" tag';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('layout.twig', require('./layout.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getExpectedDeprecationMessages() {
        return [
            'Nesting a block definition under a non-capturing node in "index.twig" at line 5 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.'
        ];
    }

    getData() {
        return {};
    }
};
