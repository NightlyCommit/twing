import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag nested block';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {%- from _self import input as linput %}

    {% block bar %}
        {{- linput('username') }}
    {% endblock %}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "linput" function in "index.twig" at line 6.';
    }
}
