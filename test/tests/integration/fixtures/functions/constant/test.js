const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

const DATE_W3C = 'DATE_W3C';

const Obj = class {

};

Obj['ARRAY_AS_PROPS'] = 2;

const object = new Obj();

module.exports = class extends TwingTestIntegrationTestCaseBase {
    run(EnvironmentCtor) {
        EnvironmentCtor['DATE_W3C'] = 'DATE_W3C';
        EnvironmentCtor['ARRAY_AS_PROPS'] = object;

        super.run(EnvironmentCtor);
    }

    getDescription() {
        return '"constant" function';
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
            expect: DATE_W3C,
            object: object
        }
    }
};
