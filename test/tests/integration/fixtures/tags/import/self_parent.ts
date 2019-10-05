import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag self parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "parent" %}
{% import _self as me %}

{% block test %}
    {{ me.hello() }}
{% endblock test %}
`,
            'parent': `
{% import _self as me %}

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
