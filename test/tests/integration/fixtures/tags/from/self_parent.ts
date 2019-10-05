import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag self parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "parent" %}

{% block test %}
    {{ _self.hello() }}
{% endblock test %}
`,
            'parent': `
{% block test %}
Hello
{% endblock test %}

{% macro hello() %}
    Test
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
Test
`;
    }

}
