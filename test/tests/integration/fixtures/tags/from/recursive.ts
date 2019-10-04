import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag recursive';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from _self import recursive_macro %}

{{ recursive_macro(10) }}

{% macro recursive_macro(n) %}
    {% if n > 0 %}
        {{- recursive_macro(n - 1) -}}
    {% endif %}
    {{- n }}
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
0
1
2
3
4
5
6
7
8
9
10
`;
    }

}
