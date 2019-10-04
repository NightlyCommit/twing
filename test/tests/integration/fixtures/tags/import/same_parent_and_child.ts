import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag nested blocks with global macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "parent" %}

{% macro anotherThing() -%}
    Do it too
{% endmacro %}

{% import _self as macros %}
{% block content %}
    {{ parent() }}
    {{ macros.anotherThing() }}
{% endblock %}
`,
            'parent': `
{% macro thing() %}
    Do it
{% endmacro %}

{% import _self as macros %}
{% block content %}
    {{ macros.thing() }}
{% endblock %}
`
        };
    }

    getExpected() {
        return `
Do it


    Do it too
`;
    }

}
