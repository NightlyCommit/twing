const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    run(EnvironmentCtor) {
        EnvironmentCtor['E_NOTICE'] = 8;
        EnvironmentCtor['TwigTestFoo::BAR_NAME'] = 'bar';

        super.run(EnvironmentCtor);
    }

    getDescription() {
        return '"constant" test';
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
        const Obj = class {

        };

        Obj['ARRAY_AS_PROPS'] = 2;

        return {
            value: 'bar',
            object: new Obj()
        };
    }
};
