import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from _self import test %}

{% macro test(a, b = 'bar') -%}
{{ a }}{{ b }}
{%- endmacro %}

{{ test('foo') }}
{{ test('bar', 'foo') }}`
        };
    }

    getExpected() {
        return `
foobar
barfoo
`;
    }
}
