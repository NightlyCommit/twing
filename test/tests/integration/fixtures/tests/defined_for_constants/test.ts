import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

const DATE_W3C = 'DATE_W3C';

/**
 * Note that the expected result from the original TwigPHP test is incorrect - but for some reason, the test passes successfully on TwigPHP.
 * @see * https://twigfiddle.com/22p2t1
 */
export = class extends TwingTestIntegrationTestCase {
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

    getGlobals() {
        let result: Map<any, any> = new Map();

        result.set(DATE_W3C, DATE_W3C);
        result.set('Map', {
            ARRAY_AS_PROPS: 2
        });

        return result;
    }

    getData() {
        return {
            expect: DATE_W3C,
            object: new Map([[0, 'hi']])
        }
    }
};