import TestBase from "../../TestBase";
import {TwingMarkup} from "../../../../../src/lib/markup";

class ToStringStub {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    toString() {
        return this.value;
    }
}

class MagicCallStub {
    // no-op, magical call makes no sense in JavaScript
}

export default class extends TestBase {
    getDescription() {
        return '"empty" test';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ string_empty is empty ? 'ok' : 'ko' }}
{{ string_zero is empty ? 'ko' : 'ok' }}
{{ value_null is empty ? 'ok' : 'ko' }}
{{ value_false is empty ? 'ok' : 'ko' }}
{{ value_int_zero is empty ? 'ko' : 'ok' }}
{{ array_empty is empty ? 'ok' : 'ko' }}
{{ array_not_empty is empty ? 'ko' : 'ok' }}
{{ magically_callable is empty ? 'ko' : 'ok' }}
{{ countable_empty is empty ? 'ok' : 'ko' }}
{{ countable_not_empty is empty ? 'ko' : 'ok' }}
{{ tostring_empty is empty ? 'ok' : 'ko' }}
{{ tostring_not_empty is empty ? 'ko' : 'ok' }}
{{ markup_empty is empty ? 'ok' : 'ko' }}
{{ markup_not_empty is empty ? 'ko' : 'ok' }}`
        };
    }

    getExpected() {
        return `
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
ok
`;
    }

    getContext() {
        return {
            string_empty: '',
            string_zero: '0',
            value_null: null as any,
            value_false: false,
            value_int_zero: 0,
            array_empty: [] as any[],
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
}
