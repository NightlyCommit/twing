const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const TwingTestToStringStub = require('../../../../../to-string-stub');
const TwingTestCountableStub = require('../../../../../countable-stub');
const TwingTestMagicCallStub = require('../../../../../magic-call-stub');

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
        return {
            array: [1, 4],
            string: 'foo',
            number: 1000,
            to_string_able: new TwingTestToStringStub('foobar'),
            countable: new TwingTestCountableStub(42), // also asserts we do *not* call toString()
            'null': null,
            magic: new TwingTestMagicCallStub(),
            non_countable: {
                toString: '' // ensure that toString is not callable
            },
        }
    }
};
