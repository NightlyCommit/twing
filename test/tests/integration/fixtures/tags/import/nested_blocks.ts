import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag nested blocks';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {%- import _self as lmacros %}

    {% block bar %}
        {{- lmacros.input('username') }}
    {% endblock %}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `lmacros` does not exist in "index.twig" at line 6.';
    }
}
