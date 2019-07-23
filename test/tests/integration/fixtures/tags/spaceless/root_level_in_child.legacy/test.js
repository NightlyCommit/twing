const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'tags/spaceless/root_level_in_child.legacy';
    }

    getDescription() {
        return '"spaceless" tag in the root level of a child template';
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
            'The "spaceless" tag in "index.twig" at line 3 is deprecated since Twig 2.7, use the "spaceless" filter instead.',
            'Using the spaceless tag at the root level of a child template in "index.twig" at line 3 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.',
            'Nesting a block definition under a non-capturing node in "index.twig" at line 4 is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.'
        ];
    }
};
