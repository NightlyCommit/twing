import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag with embed and global macro';
    }

    getTemplates() {
        return {
            'embed': `
    {% block foo %}
    {% endblock %}
`,
            'index.twig': `
{% import _self as macros %}

{% embed 'embed' %}
    {% block foo %}
        {{ macros.input("username") }}
    {% endblock %}
{% endembed %}

{% macro input(name) -%}
    <input name="{{ name }}">
{% endmacro %}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `macros` does not exist in "index.twig" at line 6.';
    }
}
