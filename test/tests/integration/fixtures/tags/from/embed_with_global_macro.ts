import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro call in embed with local macro';
    }

    getTemplates() {
        return {
            'embed.twig': `
    {% block foo %}
    {% endblock %}
`,
            'index.twig': `
{% from _self import input %}

{% embed 'embed' %}
    {% block foo %}
        {{ input("username") }}
    {% endblock %}
{% endembed %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "input" function in "index.twig" at line 6.';
    }
}
