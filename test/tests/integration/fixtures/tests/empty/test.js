const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingMarkup} = require('../../../../../../build/markup');

class ToStringStub {
    constructor(value) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class MagicCallStub {
    // no-op, magical call makes no sense in JavaScript
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"empty" test';
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
            string_empty: '',
            string_zero: '0',
            value_null: null,
            value_false: false,
            value_int_zero: 0,
            array_empty: [],
            array_not_empty: [1, 2],
            magically_callable: new MagicCallStub(),
            countable_empty: new Map(),
            countable_not_empty: new Map([[1, 2]]),
            tostring_empty: new ToStringStub(''),
            tostring_not_empty: new ToStringStub('0' /* edge case of using "0" as the string */),
            markup_empty: new TwingMarkup('', 'UTF-8'),
            markup_not_empty: new TwingMarkup('test', 'UTF-8'),
        };
    }
};
