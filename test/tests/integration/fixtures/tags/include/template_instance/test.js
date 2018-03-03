const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getData() {
        return {
            foo: this.twing.loadTemplate('foo.twig')
        };
    }

    getExpected() {
        return require('./expected.html');
    }
};
