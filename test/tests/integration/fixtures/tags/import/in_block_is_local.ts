import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag in block is local';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {%- import _self as lmacros %}
{% endblock %}

{% block bar %}
    {{- lmacros.input('username') }}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `lmacros` does not exist in "index.twig" at line 7.';
    }
}
