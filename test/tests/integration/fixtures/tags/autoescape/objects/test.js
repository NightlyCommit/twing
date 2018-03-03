const TwingTestIntegrationTestCaseBase = require('../../../../../../integration-test-case');

class UserForAutoEscapeTest {
    getName() {
        return 'Fabien<br />';
    }

    toString() {
        return 'Fabien<br />';
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
