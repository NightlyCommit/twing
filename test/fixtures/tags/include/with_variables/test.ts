import TwingTestCaseIntegration = require("../../../../../src/test-case/integration");

export = class extends TwingTestCaseIntegration {
    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('foo.twig', require('./foo.twig'));

        return templates;
    }

    getData() {
        return {
            vars: {
                foo: 'bar'
            }
        };
    }

    getExpected() {
        return require('./expected.html');
    }
};