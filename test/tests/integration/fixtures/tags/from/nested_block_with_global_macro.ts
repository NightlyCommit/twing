import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag nested block with global macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{%- from _self import input %}

{% block foo %}
    {% block bar %}
        {{- input('username') }}
    {% endblock %}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
<input name="username">
`;
    }

}
