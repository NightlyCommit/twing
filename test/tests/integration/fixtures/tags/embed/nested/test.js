const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'nested "embed" tags';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpected() {
        return `
A
            block1

        
A
                    block1

                block1extended
            B
    block2
C
    B
    block2
C
`;
    }

    getData() {
        return {
            foo: 'foo.twig'
        }
    }
};
