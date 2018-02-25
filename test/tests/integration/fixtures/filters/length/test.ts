import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";
import {TwingTestToStringStub} from "../../../../../to-string-stub";
import {TwingTestCountableStub} from "../../../../../countable-stub";
import {TwingTestMagicCallStub} from "../../../../../magic-call-stub";

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return '"length" filter';
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
        let nullValue: any = null;

        return {
            array: [1, 4],
            string: 'foo',
            number: 1000,
            to_string_able: new TwingTestToStringStub('foobar'),
            countable: new TwingTestCountableStub(42), // also asserts we do *not* call toString()
            'null': nullValue,
            magic: new TwingTestMagicCallStub(),
            non_countable: {
                toString: '' // ensure that toString is not callable
            },
        }
    }
};