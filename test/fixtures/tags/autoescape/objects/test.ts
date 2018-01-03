import TwingTestCaseIntegration = require("../../../../../src/test-case/integration");

class UserForAutoEscapeTest {
    getName() {
        return 'Fabien<br />';
    }

    toString() {
        return 'Fabien<br />';
    }
}

export = class extends TwingTestCaseIntegration {
    getDescription() {
        return '"autoescape" tag applies escaping to object method calls';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            'user': new UserForAutoEscapeTest()
        };
    }
};