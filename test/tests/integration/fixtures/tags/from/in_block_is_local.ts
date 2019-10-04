import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro in block is local';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block foo %}
    {%- from _self import input as linput %}
{% endblock %}

{% block bar %}
    {{- linput('username') }}
{% endblock %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "linput" function in "index.twig" at line 7.';
    }
}
