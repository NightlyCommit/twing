import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag nested blocks with global macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{%- import _self as macros %}

{% block foo %}
    {% block bar %}
        {{- macros.input('username') }}
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
