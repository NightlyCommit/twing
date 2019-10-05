import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as test %}
{% from _self import test %}

{% macro test(a, b) -%}
    {{ a|default('a') }}<br />
    {{- b|default('b') }}<br />
{%- endmacro %}

{{ test.test() }}
{{ test() }}
{{ test.test(1, "c") }}
{{ test(1, "c") }}`
        };
    }

    getExpected() {
        return `
a<br />b<br />
a<br />b<br />
1<br />c<br />
1<br />c<br />
`;
    }
}
