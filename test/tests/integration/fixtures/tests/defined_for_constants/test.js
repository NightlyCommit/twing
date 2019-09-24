const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

const DATE_W3C = 'DATE_W3C';

/**
 * Note that the expected result from the original TwigPHP test is incorrect - but for some reason, the test passes successfully on TwigPHP.
 * @see * https://twigfiddle.com/22p2t1
 */
module.exports = class extends TwingTestIntegrationTestCaseBase {
    run(EnvironmentCtor) {
        EnvironmentCtor['DATE_W3C'] = DATE_W3C;

        super.run(EnvironmentCtor);
    }

    getDescription() {
        return '"defined" support for constants';
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
            expect: DATE_W3C,
            object: new Obj()
        }
    }
};
