import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the ternary operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 ? 'YES' : 'NO' }}
{{ 0 ? 'YES' : 'NO' }}
{{ 0 ? 'YES' : (1 ? 'YES1' : 'NO1') }}
{{ 0 ? 'YES' : (0 ? 'YES1' : 'NO1') }}
{{ 1 == 1 ? 'foo<br />':'' }}
{{ foo ~ (bar ? ('-' ~ bar) : '') }}`
        };
    }

    getExpected() {
        return `
YES
NO
YES1
NO1
foo<br />
foo-bar
`;
    }

    getContext() {
        return {
            foo: 'foo',
            bar: 'bar'
        }
    }
}
