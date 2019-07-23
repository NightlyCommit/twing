const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'tags/spaceless/simple';
    }

    getDescription() {
        return '"spaceless" tag removes whites between HTML tags';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getExpectedDeprecationMessages() {
        return [
            'The "spaceless" tag in "index.twig" at line 2 is deprecated since Twig 2.7, use the "spaceless" filter instead.'
        ];
    }
};
