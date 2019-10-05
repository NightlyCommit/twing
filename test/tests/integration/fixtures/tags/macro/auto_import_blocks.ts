import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"macro" auto-import in blocks';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block content %}
    {{ _self.hello('Fabien') }}
{% endblock %}

{% macro hello(name) -%}
    Hello {{ _self.up(name) }}
{% endmacro %}

{% macro up(name) -%}
    {{ name|upper }}
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
Hello FABIEN
`;
    }
}
