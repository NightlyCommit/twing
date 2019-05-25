const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"embed" tag with extends';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('base.twig', require('./base.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getExpected() {
        return `
A
        blockc1base

    blockc1baseextended
        blockc2base


    
A
                block1

            block1extended
        B
    block2
C        blockc2base

B`;
    }

    getData() {
        return {
            foo: 'foo.twig'
        }
    }
};
