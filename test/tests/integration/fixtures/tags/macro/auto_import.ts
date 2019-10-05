import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"macro" auto-import';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ _self.hello('Fabien') }}

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
