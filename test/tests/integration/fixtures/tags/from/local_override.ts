import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro local override';
    }

    getTemplates() {
        return {
            'index.twig': `
{%- from _self import input %}

{% block foo %}
    {%- from "macros" import input %}
    {{- input('username') }}
{% endblock %}

{% block bar %}
    {{- input('username') }}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`,
            'macros': `
{% macro input(name) %}
    <input name="{{ name }}" value="local">
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
<input name="username" value="local">


<input name="username">
`;
    }

}
