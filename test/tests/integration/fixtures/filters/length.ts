import TestBase from "../../TestBase";
import {ToStringMock} from "../../../../mock/to-string";
import {CountableMock} from "../../../../mock/countable";

export default class extends TestBase {
    getDescription() {
        return '"length" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ array|length }}
{{ string|length }}
{{ number|length }}
{{ to_string_able|length }}
{{ countable|length }}
{{ null|length }}
{{ non_countable|length }}
{{ empty_array|length }}`
        };
    }

    getExpected() {
        return `
2
3
4
6
42
0
1
0
`;
    }

    getContext() {
        return {
            array: [1, 4],
            string: 'foo',
            number: 1000,
            to_string_able: new ToStringMock('foobar'),
            countable: new CountableMock(42), // also asserts we do *not* call toString()
            'null': null,
            non_countable: {
                toString: '' // ensure that toString is not callable
            },
            empty_array: []
        } as any
    }
}
